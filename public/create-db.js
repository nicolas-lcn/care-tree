const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


db.prepare('DROP TABLE IF EXISTS category').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('DROP TABLE IF EXISTS challenge').run();

db.prepare('CREATE TABLE category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, bonusPoints INTEGER)').run();
db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, points INTEGER, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER)').run();