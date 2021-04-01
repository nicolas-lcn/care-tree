const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS category').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();

db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, points INTEGER, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER, state INTEGER, author TEXT,'
          + 'FOREIGN KEY (state) REFERENCES state(id), FOREIGN KEY (author) REFERENCES user(username))').run();
db.prepare('CREATE TABLE acceptedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (userid) REFERENCES user(id))').run();

db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'admin\', \'1234\', \'\', 0, 1)').run();
let user1 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'SuperMarmotte\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user2 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PachydermeDélicat\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user3 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PapillonCourageux\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
let user4 = db.prepare('INSERT INTO user (username, password, profilePic, points, isAdmin) VALUES (\'PieuvreDumbo\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;


let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES ('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, ?, ?, ?)").run(eco, open, user1);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES ('Donner son sang', 'Donner son sang permet de sauver 3 vies !', 10, 0, ?, ?, ?)").run(health, open, user2);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES ('Complimenter un inconnu', '', 3, 0, ?, ?, ?)").run(kindness, open, user3);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES ('No meat !', 'Ne pas manger de viande pendant toute une semaine.', 15, 1, ?, ?, ?)").run(eco, open, user1);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES (?, ?, ?, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", 'Tout est dit dans le titre :)', 15, 1, open, user3);
