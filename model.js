"use strict";
const Sqlite = require("better-sqlite3");

let db = new Sqlite("db.sqlite");

exports.getChallenges = page => {
  const num_per_page = 4;
  page = parseInt(page || 1);

  var num_found = db.prepare("SELECT count(*) FROM challenge").get()[
    "count(*)"
  ];
  var results = db
    .prepare(
      "SELECT challenge.id, title, description, nbUpvotes, category.name AS categoryName, state, username " +
        "FROM challenge JOIN category ON challenge.category = category.id " +
        "JOIN state ON challenge.state = state.id " +
        "JOIN user ON challenge.user = user.id " +
        "ORDER BY challenge.id LIMIT ? OFFSET ?"
    )
    .all(num_per_page, (page - 1) * num_per_page);

  return {
    results: results,
    num_found: num_found,
    prev_page: page > 1 ? page - 1 : 1,
    next_page: page * num_per_page <= num_found ? page + 1 : page,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1
  };
};

exports.login = (username, password) => {
  let select = db
    .prepare("SELECT id FROM user WHERE username = ? AND password = ?")
    .get(username, password);
  console.log(select);
  return (select? select:-1);
};
