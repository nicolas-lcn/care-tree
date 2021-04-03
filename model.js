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

  var num_found = db.prepare("SELECT count(*) FROM challenge").get()[
    "count(*)"
  ];
  var results = db
    .prepare(
      "SELECT challenge.id, title, description, nbUpvotes, state, author " +
        "FROM challenge " +
        "ORDER BY challenge.id LIMIT ? OFFSET ?"
    )
    .all(num_per_page, (page - 1) * num_per_page);

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
  
  return (compare_password(password, select.password) ? select.username: null);
};

exports.new_user = (username, password) => {
  let insert = db.prepare("INSERT INTO user (username, password) VALUES (?,?)");
  let cryptedPassword = crypt_password(password);
  insert.run(username, cryptedPassword);
  return (insert.changes!=0)? username : null;
};
