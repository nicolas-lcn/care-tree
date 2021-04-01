const Sqlite = require('better-sqlite3');
const bcrypt = require('bcrypt');

let db = new Sqlite('db.sqlite');

function crypt_password(password) {
  var saved_hash = bcrypt.hashSync(password,10);
  return saved_hash;
}

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
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();

let username1 = "SuperMarmotton";
let username2 = "PachydermeDéclicat";
let username3 = "PapillonCourageux";
let username4 = "PieuvreDumbo;"

let password = crypt_password('1234');

db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0, 1)').run('admin', password);
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0, 0)').run(username1, password).lastInsertRowid;
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0, 0)').run(username2, password).lastInsertRowid;
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0, 0)').run(username3, password).lastInsertRowid;
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0, 0)').run(username4, password).lastInsertRowid;

let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, open, username1);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Donner son sang', 'Donner son sang permet de sauver 3 vies !', 10, 0, open, username2);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('Complimenter un inconnu', '', 3, 0, open, username3);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author) VALUES "
           + "(?, ?, ?, ?, ?, ?)").run('No meat !', 'Ne pas manger de viande pendant toute une semaine.', 15, 1, open, username4);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author) "
           + "VALUES (?, ?, ?, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", 'Tout est dit dans le titre :)', 15, 1, open, username1);
