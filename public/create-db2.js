const Sqlite = require('better-sqlite3');
const bcrypt = require('bcrypt');

let db = new Sqlite('db.sqlite');

function crypt_password(password) {
  var saved_hash = bcrypt.hashSync(password,10);
  return saved_hash;
}

db.prepare('DROP TABLE IF EXISTS acceptedchallenges').run();
db.prepare('DROP TABLE IF EXISTS succeededchallenges').run();
db.prepare('DROP TABLE IF EXISTS likedchallenges').run();
db.prepare('DROP TABLE IF EXISTS reportedchallenges').run();
db.prepare('DROP TABLE IF EXISTS userchallenge').run();
db.prepare('DROP TABLE IF EXISTS challenge').run();
db.prepare('DROP TABLE IF EXISTS state').run();
db.prepare('DROP TABLE IF EXISTS user').run();

db.prepare('CREATE TABLE user (username TEXT PRIMARY KEY, password TEXT, profilePic TEXT, isAdmin INTEGER)').run();
db.prepare('CREATE TABLE state (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
db.prepare('CREATE TABLE challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, state INTEGER, author TEXT, expireDate INTEGER, '
          + 'FOREIGN KEY (state) REFERENCES state(id), FOREIGN KEY (author) REFERENCES user(username))').run();
db.prepare('CREATE TABLE acceptedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();
db.prepare('CREATE TABLE succeededchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();
db.prepare('CREATE TABLE likedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();
db.prepare('CREATE TABLE reportedchallenges (challengeid INTEGER, username TEXT, '
          + 'PRIMARY KEY(challengeid, username), FOREIGN KEY (challengeid) REFERENCES challenge(id), FOREIGN KEY (username) REFERENCES user(username))').run();

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

let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let suspended = db.prepare('INSERT INTO state (name) VALUES (\'SUSPENDED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;



let expireDate = Date.now() + 24 * 60 * 60 * 1000 * 7; // 7 days

// INSERT CHALLENGE

let chall1 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Se débarrasser de ses vieux vêtements', 'Donnez-les ou revendez-les !', open, username1, expireDate).lastInsertRowid;
let chall2 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Donner son sang', 'Donner son sang permet de sauver 3 vies !', open, username2, expireDate).lastInsertRowid;
let chall3 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Complimenter un inconnu', '', open, username3, expireDate).lastInsertRowid;
let chall4 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('No meat !', 'Ne pas manger de viande pendant toute une semaine.', open, username4, expireDate).lastInsertRowid;
let chall5 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Donner 20€ à l'association de votre choix", 'Tout est dit dans le titre :)', open, username1, expireDate).lastInsertRowid;

let chall6 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', open, username1, Date.now() - 1000).lastInsertRowid;
let chall7 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', closed, username1, expireDate).lastInsertRowid;

let chall8 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Supprimez vos mails !", "supprimer 30 messages permet d'économiser l'équivalent de la consommation d'une ampoule pendant une journée !", open, username3, expireDate).lastInsertRowid;

let chall9 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Contenu diffamatoire !", "Signalez-le et ce défi sera suspendu !", open, username4, expireDate).lastInsertRowid;


// Accept Challenges
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username2);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall2, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall2, username4);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall3, username2);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall5, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username4);

// Succeed Challenges
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall1, username1);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall2, username1);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall1, username2);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall3, username3);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall4, username3);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall1, username4);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall8, username2);

// Like Challenges
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall1, username1);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall1, username2);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall1, username3);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall1, username4);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall8, username1);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall8, username2);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall8, username3);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall8, username4);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall2, username1);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall2, username2);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall3, username1);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall3, username3);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall3, username4);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall5, username1);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall4, username4);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall4, username2);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall9, username3);
db.prepare("INSERT INTO likedchallenges VALUES(?, ?)").run(chall9, username4);


// Report Challenges
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall3, username1);
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall3, username2);
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall2, username3);
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall1, username4);
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall9, username4);
db.prepare("INSERT INTO reportedchallenges VALUES(?, ?)").run(chall9, username3);


// Filler challenges
let fill1 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill2 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill3 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill4 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill5 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill6 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill7 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill8 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill9 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill10 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill11 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill12 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill13 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill14 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill15 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill16 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
let fill17 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler", "Défi filler pour avoir un aperçu de l'application !", open, username4, expireDate).lastInsertRowid;
