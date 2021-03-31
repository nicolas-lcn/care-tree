const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS category').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();

db.prepare('CREATE TABLE category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, bonusPoints INTEGER)').run();
db.prepare('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, profilePic TEXT, points INTEGER, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER, category INTEGER, state INTEGER, user INTEGER,'
          + 'FOREIGN KEY (category) REFERENCES category(id), FOREIGN KEY (state) REFERENCES state(id), FOREIGN KEY (user) REFERENCES user(id))').run();
db.prepare('CREATE TABLE acceptedchallenges (challengeid INTEGER, userid INTEGER, '
          + 'PRIMARY KEY(challengeid, userid), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (userid) REFERENCES user(id))').run();

db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'admin\', \'1234\', \'\', 0, 1)').run();
let user1 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'SuperMarmotte\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user2 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PachydermeDélicat\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user3 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PapillonCourageux\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user4 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PieuvreDumbo\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;

let eco = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'écologie\', 100)').run().lastInsertRowid;
let health = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'santé\', 100)').run().lastInsertRowid;
let kindness = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'gentillesse\', 100)').run().lastInsertRowid;
let expensive = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'coûteux\', 100)').run().lastInsertRowid;
let other = db.prepare('INSERT INTO category (name, bonusPoints) VALUES (\'autre\', 0)').run().lastInsertRowid;


let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES ('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, ?, ?, ?)").run(eco, open, user1);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES ('Donner son sang', 'Donner son sang permet de sauver 3 vies !', 10, 0, ?, ?, ?)").run(health, open, user2);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES ('Complimenter un inconnu', '', 3, 0, ?, ?, ?)").run(kindness, open, user3);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES ('No meat !', 'Ne pas manger de viande pendant toute une semaine.', 15, 1, ?, ?, ?)").run(eco, open, user1);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, category, state, user) VALUES (?, 'Tout est dit dans le titre :)', 15, 1, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", expensive, open, user3);