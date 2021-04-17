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
 //////////////////////// CHALLENGE MODIFY /////////////////////////////

exports.createChallenge = (username, title, description) => {
  let open = db.prepare("SELECT id FROM state WHERE name = ?").get("OPEN").id
  if (!description) description = " ";
  db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
    + "VALUES (?, ?, ?, ?, ?)").run(title, description, open, username, Date.now() + 24 * 60 * 60 * 1000);

}

exports.acceptChallenge = (username, challengeid) => {
  let alreadyAccepted = db.prepare("SELECT * FROM acceptedchallenges WHERE username = ? AND challengeid = ?" +
                                  "UNION SELECT * FROM succeededchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid, username, challengeid);
  if (alreadyAccepted) return false;
  db.prepare("INSERT INTO acceptedchallenges VALUES (?, ?)").run(challengeid, username)
  return true;
}

exports.endChallenge = (username, challengeid) => {
  let confirmAccepted = db.prepare("SELECT * FROM acceptedchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (confirmAccepted) {
    db.prepare("DELETE FROM acceptedchallenges WHERE username = ? AND challengeid = ?").run(username, challengeid);
  }
  
  let alreadySucceeded = db.prepare("SELECT * FROM succeededchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (alreadySucceeded) return false;
  db.prepare("INSERT INTO succeededchallenges VALUES (?, ?)").run(challengeid, username)
  return true;
}

exports.abandonChallenge = (username, challengeid) => {
  let confirmAccepted = db.prepare("SELECT * FROM acceptedchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (! confirmAccepted) return false;
    
  let del = db.prepare("DELETE FROM acceptedchallenges WHERE username = ? AND challengeid = ?").run(username, challengeid);
  return del.changes != 0;
}

exports.delChallenge = (username, challengeid) => {
  let confirmSucceeded = db.prepare("SELECT * FROM succeededchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (! confirmSucceeded) return false;
    
  let del = db.prepare("DELETE FROM succeededchallenges WHERE username = ? AND challengeid = ?").run(username, challengeid);
  return del.changes != 0;
}

exports.upvote = (username, challengeid) => {
  let alreadyLiked = db.prepare("SELECT * FROM likedchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (alreadyLiked) return false;
    
  let insert = db.prepare("INSERT INTO likedchallenges VALUES (?, ?)").run(challengeid, username);
  return insert.changes != 0;
}

exports.cancelUpvote = (username, challengeid) => {
  console.log("ok")
  let confirmLiked = db.prepare("SELECT * FROM likedchallenges WHERE username = ? AND challengeid = ?").get(username, challengeid);
  if (! confirmLiked) return false;
  console.log("ok")
  let del = db.prepare("DELETE FROM likedchallenges WHERE challengeid = ? AND username = ?").run(challengeid, username);
  return del.changes != 0;
}

 //////////////////////// CHALLENGE GET /////////////////////////////


exports.getChallenges = (page, username) => {
  const num_per_page = 9;
  page = parseInt(page || 1);

  var num_found = db.prepare("SELECT count(*) FROM challenge " +
            "JOIN state ON challenge.state = state.id " +
            "WHERE expireDate > ? AND state.name = ?").get(Date.now(), "OPEN")["count(*)"];

  
  let results = db.prepare(
      "SELECT challenge.id AS id, title, description, COUNT(likedchallenges.username) AS nbUpvotes, author, profilePic " +
      "FROM challenge " +
      "LEFT JOIN likedchallenges ON likedchallenges.challengeid = challenge.id " +
      "JOIN state ON challenge.state = state.id " +
      "JOIN user ON user.username = challenge.author " +
      "WHERE expireDate > ? " +
      "AND state.name = ? " +
      "GROUP BY challenge.id, title, description, author, profilePic " +
      "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ? "
  ).all(Date.now(), "OPEN", num_per_page, (page - 1) * num_per_page);
  
  if (username) {
    for (let result of results) {
      result.hasLiked = db.prepare(
          "SELECT * " +
            "FROM likedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username);
      result.hasAccepted = db.prepare(
          "SELECT * " +
            "FROM acceptedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? " +
            "UNION " +
            "SELECT * FROM succeededchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username, result.id, username);
      result.hasReported = db.prepare(
          "SELECT * " +
            "FROM reportedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username);
    }
  }

  return {
    results: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page >= num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.getAcceptedChallenges = (page, username) => {
  const num_per_page = 9;
  page = parseInt(page || 1);

  let num_found = db.prepare("SELECT count(*) FROM acceptedchallenges " +
                            "JOIN challenge ON acceptedchallenges.challengeid = challenge.id " +
                            "JOIN state ON challenge.state = state.id " +
                            "WHERE username = ? AND state.name = ?").get(username, "OPEN")["count(*)"];
  
 let results = db.prepare(
      "SELECT challenge.id AS id, title, description, COUNT(likedchallenges.username) AS nbUpvotes, author, profilePic " +
      "FROM challenge " +
      "LEFT JOIN likedchallenges ON likedchallenges.challengeid = challenge.id " +
      "JOIN state ON challenge.state = state.id " +
      "JOIN user ON user.username = challenge.author " +
      "AND state.name = ? " +
      "AND challenge.id IN " +
      "(SELECT challengeid FROM acceptedchallenges " +
      "WHERE username = ? ) " +
      "GROUP BY challenge.id, title, description, author, profilePic " +
      "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ? "
  ).all("OPEN", username, num_per_page, (page - 1) * num_per_page);

  for (let result of results) {
      result.hasLiked = db.prepare(
          "SELECT * " +
            "FROM likedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username);
    }
  
  return {
    acceptedchallenges: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page >= num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.getSucceededChallenges = (page, username) => {
  const num_per_page = 9;
  page = parseInt(page || 1);

  let num_found = db.prepare("SELECT count(*) FROM succeededchallenges " +
                            "WHERE username = ?").get(username)["count(*)"];
  
 let results = db.prepare(
      "SELECT challenge.id AS id, title, description, COUNT(likedchallenges.username) AS nbUpvotes, author, profilePic " +
      "FROM challenge " +
      "LEFT JOIN likedchallenges ON likedchallenges.challengeid = challenge.id " +
      "JOIN state ON challenge.state = state.id " +
      "JOIN user ON user.username = challenge.author " +
      "WHERE expireDate > ? " +
      "AND state.name = ? " +
      "AND challenge.id IN " +
      "(SELECT challengeid FROM succeededchallenges " +
      "WHERE username = ? ) " +
      "GROUP BY challenge.id, title, description, author, profilePic " +
      "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ? "
  ).all(Date.now(), "OPEN", username, num_per_page, (page - 1) * num_per_page);

  for (let result of results) {
      result.hasLiked = db.prepare(
          "SELECT * " +
            "FROM likedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username);
    }
  
  return {
    succeededchallenges: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page >= num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.getCreatedChallenges = (page, username) => {
  const num_per_page = 9;
  page = parseInt(page || 1);

  let num_found = db.prepare("SELECT count(*) FROM challenge " +
                            "WHERE author = ?").get(username)["count(*)"];
  
 let results = db.prepare(
      "SELECT challenge.id AS id, title, description, COUNT(likedchallenges.username) AS nbUpvotes, author, profilePic " +
      "FROM challenge " +
      "LEFT JOIN likedchallenges ON likedchallenges.challengeid = challenge.id " +
      "JOIN state ON challenge.state = state.id " +
      "JOIN user ON user.username = challenge.author " +
      "WHERE expireDate > ? " +
      "AND state.name = ? " +
      "AND author = ? " +
      "GROUP BY challenge.id, title, description, author, profilePic " +
      "ORDER BY nbUpvotes DESC LIMIT ? OFFSET ? "
  ).all(Date.now(), "OPEN", username, num_per_page, (page - 1) * num_per_page);

  for (let result of results) {
      result.hasLiked = db.prepare(
          "SELECT * " +
            "FROM likedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username);
      result.hasAccepted = db.prepare(
          "SELECT * " +
            "FROM acceptedchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? " +
            "UNION " +
            "SELECT * FROM succeededchallenges " +
            "WHERE challengeid = ? " +
            "AND username = ? "
        ).get(result.id, username, result.id, username);
    }
  
  return {
    createdchallenges: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    prev_disabled: page == 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    next_disabled: page * num_per_page >= num_found,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};


function getNumberOfLikes(challengeid){
  let nbLikes  = db.prepare("SELECT COUNT(challengeid) as nbLikes FROM likedchallenges WHERE challengeid = ?");
  return nbLikes.get(challengeid);
};

exports.getPoints = (username) =>{
  let select = db.prepare("SELECT challengeid FROM succeededchallenges WHERE username = ?").all(username);
  let points = select.length * 100;
  for(let index =0; index<select.length; index++){
    points += getNumberOfLikes(select[index].challengeid).nbLikes*2;
  }
  return points;
}

exports.getTree = (username) => {
  let points = this.getPoints(username);
  
    if(points>500)
      return "https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fsprout.png?v=1618234931458";
    else if(points>1000)
      return "https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fsprout2.png?v=1618234934510";
    else if (points>1500)
      return "https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fsprout3.png?v=1618234937138";
    else if (points>2000)
      return "https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fsprout4.png?v=1618234943870";
    else
      return "https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fsprout0.png?v=1618234904927";
  
}


 /////////////////////////////////// USER//////////////////////////

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

exports.getProfilePicURL = (username) =>{
  let select = db.prepare("SELECT profilePic FROM user WHERE username = ?").get(username);
  return (select)? select.profilePic : null;
};
   
      //Edit User //

exports.edit_user_infos = (username, password) => {
  let verify = db.prepare("SELECT * FROM user WHERE username = ?").get(username);
  if( ! verify) return -1;
  let update = db.prepare("UPDATE user SET password = ? WHERE username = ?");
  let cryptedPassword = crypt_password(password);
  update.run(cryptedPassword, username);
  return (update.changes!=0)? 0 : -1;
};


exports.edit_profilePic = (username, profilePicURL) =>{
  let update = db.prepare("UPDATE user SET profilePic = ? WHERE username = ?");
  update.run(profilePicURL, username);
  return (update.changes!=0)? 0 : -1;
};
