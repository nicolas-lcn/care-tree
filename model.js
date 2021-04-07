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


exports.getChallenges = page => {
  const num_per_page = 4;
  page = parseInt(page || 1);

  var num_found = db.prepare("SELECT count(*) FROM challenge " +
            "JOIN state ON challenge.state = state.id " +
            "WHERE expireDate > ? AND state.name = ?").get(Date.now(), "OPEN")["count(*)"];
  
  var results = db
    .prepare(
      "SELECT challenge.id, title, description, nbUpvotes, state.name, author " +
        "FROM challenge " +
        "JOIN state ON challenge.state = state.id " +
        "WHERE expireDate > ? " +
        "AND state.name = ? " +
        "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ?"
    )
    .all(Date.now(), "OPEN", num_per_page, (page - 1) * num_per_page);

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
  
  if (!select.password) return null;
  return (compare_password(password, select.password) ? select.username: null);
};

exports.new_user = (username, password) => {
  let verify = db.prepare("SELECT * FROM user WHERE username = ?").get(username);
  if(verify) return null;
  let insert = db.prepare("INSERT INTO user (username, password) VALUES (?,?)");
  let cryptedPassword = crypt_password(password);
  insert.run(username, cryptedPassword);
  return (insert.changes!=0)? username : null;
};

exports.createChallenge = (username, title, description) => {
  let open = db.prepare("SELECT id FROM state WHERE name = ?").get("OPEN").id
  
  console.log(username)
  console.log(title)
  console.log(description)
  console.log(open)
  if (!description) description = " ";
  console.log(description)
  
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
