const Sqlite = require('better-sqlite3');
const bcrypt = require('bcrypt');

let db = new Sqlite('db.sqlite');

function crypt_password(password) {
  var saved_hash = bcrypt.hashSync(password,10);
  return saved_hash;
}

db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();
db.prepare('DROP TABLE IF EXISTS terminatedchallenges').run();
db.prepare('DROP TABLE IF EXISTS userchallenge').run();
db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();

db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, nbUpvotes INTEGER, nbReports INTEGER, author TEXT, expireDate INTEGER, '
          + 'FOREIGN KEY (author) REFERENCES user(username))').run();
db.prepare('CREATE TABLE userchallenge (challengeid INTEGER, username TEXT, isLiked INTEGER, isReported INTEGER, state INTEGER'
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username), FOREIGN KEY (state) REFERENCES state(id))').run();

let username1 = "SuperMarmotton";
let username2 = "PachydermeDélicat";
let username3 = "PapillonCourageux";
let username4 = "PieuvreDumbo";

let password = crypt_password('1234');

db.prepare('INSERT INTO user VALUES (?, ?, \'\', 1)').run('admin', password);
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0)').run(username1, password);
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0)').run(username2, password);
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0)').run(username3, password);
db.prepare('INSERT INTO user VALUES (?, ?, \'\', 0)').run(username4, password);

let accepted = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let reported = db.prepare('INSERT INTO state (name) VALUES (\'REPORTED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;


expireDate = Date.now() + 24 * 60 * 60 * 1000 * 7;

// INSERT CHALLENGE

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?, ?, ?)").run('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', 5, 0, open, username1, expireDate);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?, ?, ?)").run('Donner son sang', 'Donner son sang permet de sauver 3 vies !', 10, 0, open, username2, expireDate);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?, ?, ?)").run('Complimenter un inconnu', '', 3, 0, open, username3, expireDate);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?, ?, ?)").run('No meat !', 'Ne pas manger de viande pendant toute une semaine.', 15, 1, open, username4, expireDate);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", 'Tout est dit dans le titre :)', 15, 1, open, username1, expireDate);

db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', 0, 0, open, username1, Date.now() - 1000);
db.prepare("INSERT INTO challenge (title, description, nbUpvotes, nbReports, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', 0, 0, closed, username1, expireDate);


// INSERT ACCEPTED CHALLENGES 
db.prepare("INSERT INTO acceptedchallenges VALUES (?, ?)").run(1, username2)
db.prepare("INSERT INTO acceptedchallenges VALUES (?, ?)").run(3, username2)
db.prepare("INSERT INTO acceptedchallenges VALUES (?, ?)").run(4, username2)
