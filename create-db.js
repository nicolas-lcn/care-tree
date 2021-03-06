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
let username2 = "PachydermeD??licat";
let username3 = "PapillonCourageux";
let username4 = "PieuvreDumbo";
let anonymous = "Anonyme";

let password = crypt_password('1234');

db.prepare('INSERT INTO user VALUES (?, ?, ?, 1)').run('admin', password, '');
db.prepare('INSERT INTO user VALUES (?, ?, ?, 0)').run(username1, password, 'https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fcon29.png?v=1617872023972');
db.prepare('INSERT INTO user VALUES (?, ?, ?, 0)').run(username2, password, 'https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fcon4.png?v=1617872003351');
db.prepare('INSERT INTO user VALUES (?, ?, ?, 0)').run(username3, password, 'https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fcon5.png?v=1617872004582');
db.prepare('INSERT INTO user VALUES (?, ?, ?, 0)').run(username4, password, 'https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fcon9.png?v=1617872011096');
db.prepare('INSERT INTO user VALUES (?, ?, ?, 0)').run(anonymous, password, 'https://cdn.glitch.com/f9be0b84-d35c-45c8-8689-5d4042a91ff2%2Fcon9.png?v=1617872011096');

let open = db.prepare('INSERT INTO state (name) VALUES (\'OPEN\')').run().lastInsertRowid;
let suspended = db.prepare('INSERT INTO state (name) VALUES (\'SUSPENDED\')').run().lastInsertRowid;
let closed = db.prepare('INSERT INTO state (name) VALUES (\'CLOSED\')').run().lastInsertRowid;



let expireDate = Date.now() + 24 * 60 * 60 * 1000 * 7; // 7 days

// INSERT CHALLENGE

let chall1 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Se d??barrasser de ses vieux v??tements', 'Donnez-les ou revendez-les !', open, username1, expireDate).lastInsertRowid;
let chall2 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Donner son sang', 'Donner son sang permet de sauver 3 vies !', open, username2, expireDate).lastInsertRowid;
let chall3 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('Complimenter un inconnu', '', open, username3, expireDate).lastInsertRowid;
let chall4 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) VALUES "
           + "(?, ?, ?, ?, ?)").run('No meat !', 'Ne pas manger de viande pendant toute une semaine.', open, username4, expireDate).lastInsertRowid;
let chall5 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Donner 20??? ?? l'association de votre choix", 'Tout est dit dans le titre :)', open, username1, expireDate).lastInsertRowid;

let chall6 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', open, username1, Date.now() - 1000).lastInsertRowid;
let chall7 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("This challenge should not appear !", 'If you see this, there is a problem somewhere...', closed, username1, expireDate).lastInsertRowid;

let chall8 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Supprimez vos mails !", "supprimer 30 messages permet d'??conomiser l'??quivalent de la consommation d'une ampoule pendant une journ??e !", open, username3, expireDate).lastInsertRowid;

let chall9 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Contenu diffamatoire !", "Ce d??fi a d??j?? ??t?? signal?? 2 fois, signalez-le et il sera suspendu !", open, username4, expireDate).lastInsertRowid;

// Suspended challenges 
db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("D??fi suspendu", "?? vous de juger !", suspended, username1, expireDate);
db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("D??fi suspendu n??2", "?? vous de juger !", suspended, username2, expireDate);
db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("D??fi suspendu n??3", "?? vous de juger !", suspended, username3, expireDate);


// Accept Challenges
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username2);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall1, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall2, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall2, username4);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall5, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username1);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username3);
db.prepare("INSERT INTO acceptedchallenges VALUES(?, ?)").run(chall8, username4);

// Succeed Challenges
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall1, username1);
db.prepare("INSERT INTO succeededchallenges VALUES(?, ?)").run(chall2, username1);
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
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 1", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill2 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 2", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill3 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 3", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill4 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 4", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill5 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 5", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill6 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 6", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill7 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 7", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill8 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 8", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill9 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 9", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill10 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 10", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill11 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 11", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill12 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 12", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill13 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 13", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill14 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 14", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill15 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 15", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill16 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 16", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill17 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 17", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill18 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 18", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill19 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 19", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
let fill20 = db.prepare("INSERT INTO challenge (title, description, state, author, expireDate) "
           + "VALUES (?, ?, ?, ?, ?)").run("Filler 20", "D??fi filler pour avoir un aper??u de l'application !", open, username4, expireDate).lastInsertRowid;
