const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


b.prepare('DROP TABLE IF EXISTS recipe').run();
  db.prepare('DROP TABLE IF EXISTS ingredient').run();
  db.prepare('DROP TABLE IF EXISTS stage').run();
  db.prepare('DROP TABLE IF EXISTS user').run();