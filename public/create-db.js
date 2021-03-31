const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


db.prepare('DROP TABLE IF EXISTS category').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();

db.prepare('CREATE TABLE category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, bonusPoints INTEGER)').run();
db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, points INTEGER, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER, category INTEGER, state INTEGER, user TEXT,'
          + 'FOREIGN KEY (category) REFERENCES category(id), FOREIGN KEY (state) REFERENCES state(id), FOREIGN KEY (user) REFERENCES user(username))').run();
db.prepare('CREATE TABLE acceptedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();

db.prepare('INSERT INTO user VALUES (\'admin\', \'1234\', \'\', 0, 1)').run();
let user1 = db.prepare('INSERT INTO user VALUES (\'superMarmotte\', \'1234\', \'\', 0, 0)').run().lastInsertRowId;
let user2 = db.prepare('INSERT INTO user VALUES (\'PachydermeDélicat\', \'1234\', \'\', 0, 0)').run().lastInsertRowId;
let user3 = db.prepare('INSERT INTO user VALUES (\'PapillonCourageux\', \'1234\', \'\', 0, 0)').run().lastInsertRowId;
let user4 = db.prepare('INSERT INTO user VALUES (\'PieuvreDumbo\', \'1234\', \'\', 0, 0)').run().lastInsertRowId;

let eco = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'écologie\', 100)').run().lastInsertRowId;
let health = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'santé\', 100)').run().lastInsertRowId;
let kindness = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'gentillesse\', 100)').run().lastInsertRowId;
let expensive = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'\', 100)').run().lastInsertRowId;
let other = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'autre\', 0)').run().lastInsertRowId;


let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowId;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowId;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowId;

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES ('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, ?, ?, ?)").run(eco, open, user1);
