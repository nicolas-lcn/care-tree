"use strict"
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.search = (page) => {
  const num_per_page = 32;
  page = parseInt(page || 1);

  
  var num_found = db.prepare('SELECT count(*) FROM challenges').get()['count(*)'];
  var results = db.prepare('SELECT id as entry, title, img FROM recipe ORDER BY id LIMIT ? OFFSET ?').all(num_per_page, (page - 1) * num_per_page);

  return {
    results: results,
    num_found: num_found,
    prev_page: (page > 1) ? page - 1 : 1,
    next_page: (page * num_per_page <= num_found)? page + 1 : page,
    page: page,
    num_pages: parseInt(num_found / num_per_page) + 1,
  };
};