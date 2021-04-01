const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS category').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();

db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, points INTEGER, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER, state INTEGER, author TEXT, '
          + 'FOREIGN KEY (state) REFERENCES state(id), FOREIGN KEY (author) REFERENCES user(username))').run();
db.prepare('CREATE TABLE acceptedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (userid) REFERENCES user(id))').run();

let username1 = "SuperMarmotton";
let username2 = "PachydermeDéclicat";
let 

db.prepare('INSERT INTO user VALUES (\'admin\', \'1234\', \'\', 0, 1)').run();
db.prepare('INSERT INTO user VALUES (\'SuperMarmotte\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
db.prepare('INSERT INTO user VALUES (\'PachydermeDélicat\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
db.prepare('INSERT INTO user VALUES (\'PapillonCourageux\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;
db.prepare('INSERT INTO user VALUES (\'PieuvreDumbo\', \'1234\', \'\', 0, 0)').run().lastInsertRowid;


let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, open, 'SuperMarmotte');
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Donner son sang', 'Donner son sang permet de sauver 3 vies !', 10, 0, open, 'PachydermeDélicat');
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Complimenter un inconnu', '', 3, 0, open, 'PapillonCourageux');
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('No meat !', 'Ne pas manger de viande pendant toute une semaine.', 15, 1, open, 'SuperMarmotte');
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, user) "
           + "VALUES (?, ?, ?, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", 'Tout est dit dans le titre :)', 15, 1, open, 'PieuvreDumbo');