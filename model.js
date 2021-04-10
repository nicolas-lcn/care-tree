"use strict";
const Sqlite = require("better-sqlite3");
const bcrypt = require("bcrypt");

let db = new Sqlite("db.sqlite");


function compare_password (password, saved_hash) {
  return bcrypt.compareSync(password, saved_hash);
}; 

function crypt_password(password) {
  var saved_hash = bcrypt.hashSync(password,10);
  return saved_hash;
}

exports.getChallenges = (page, username) => {
  const num_per_page = 4;
  page = parseInt(page || 1);

  var num_found = db.prepare("SELECT count(*) FROM challenge " +
            "JOIN state ON challenge.state = state.id " +
            "WHERE expireDate > ? AND state.name = ? AND author != ? ").get(Date.now(), "OPEN", username)["count(*)"];
  /*
  var results = db
    .prepare(
      "SELECT challenge.id, title, description, nbUpvotes, state.name, author " +
        "FROM challenge " +
        "JOIN state ON challenge.state = state.id " +
        "WHERE expireDate > ? " +
        "AND state.name = ? " +
        "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ?"
    )
    .all(Date.now(), "OPEN", num_per_page, (page - 1) * num_per_page); */
  
  //if (username) {
      var results = db.prepare(
        "SELECT challenge.id, title, description, COUNT(isLike) AS nbUpvotes, author " +
          "FROM challenge " +
          "JOIN state ON challenge.state = state.id " +
          "JOIN userchallenge ON challenge.id = userchallenge.challengeid " +
          "WHERE expireDate > ? " +
          "AND state.name = ? " +
          "AND author != ? " +
          "GROUP BY challenge.id, title, description, state.name, author " +
          "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ?"
      ).all(Date.now(), "OPEN", username, num_per_page, (page - 1) * num_per_page);
    
  //}


  
  return {
    results: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page > num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.getAcceptedChallenges = (page, username) => {
  const num_per_page = 6;
  page = parseInt(page || 1);

  var num_found = db.prepare("SELECT count(*) FROM acceptedchallenges " +
            "JOIN user ON acceptedchallenges.username = user.username ").get()["count(*)"];
  
  var results = db
    .prepare(
      "SELECT challenge.id, title, description, nbUpvotes, author " +
        "FROM challenge " +
        "JOIN acceptedchallenges ON challenge.id = acceptedchallenges.challengeid " +
        "WHERE username == ? " +
        "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ?"
    )
    .all(username, num_per_page, (page - 1) * num_per_page);

  return {
    results: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page > num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.login = (username, password) => {
  let select = db.prepare("SELECT username, password FROM user WHERE username = ?")
    .get(username);
  if (!select || !select.password) return null;
  return (compare_password(password, select.password))? select.username: null;
};

exports.new_user = (username, password, profilePicURL) => {
  let verify = db.prepare("SELECT * FROM user WHERE username = ?").get(username);
  if(verify) return null;
  let insert = db.prepare("INSERT INTO user (username, password, profilePic, isAdmin) VALUES (?,?,?,?)");
  let cryptedPassword = crypt_password(password);
  insert.run(username, cryptedPassword, profilePicURL,0);
  return (insert.changes!=0)? username : null;
};

exports.createChallenge = (username, title, description) => {
  let open = db.prepare("SELECT id FROM state WHERE name = ?").get("OPEN").id
  if (!description) description = " ";
  db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) "
    + "VALUES (?, ?, ?, ?, ?, ?, ?)").run(title, description, 0, 0, open, username, Date.now() + 24 * 60 * 60 * 1000);

}


exports.edit_user_infos = (username, password) => {
  let verify = db.prepare("SELECT * FROM user WHERE username = ?").get(username);
  if( ! verify) return -1;
  let update = db.prepare("UPDATE user SET password = ? WHERE username = ?");
  let cryptedPassword = crypt_password(password);
  update.run(cryptedPassword, username);
  return (update.changes!=0)? 0 : -1;
};

exports.getProfilePicURL = (username) =>{
  let select = db.prepare("SELECT profilePic FROM user WHERE username = ?").get(username);
  return (select)? select.profilePic : null;
};

exports.edit_profilePic = (username, profilePicURL) =>{
  let update = db.prepare("UPDATE user SET profilePic = ? WHERE username = ?");
  update.run(profilePicURL, username);
  return (update.changes!=0)? 0 : -1;
};
