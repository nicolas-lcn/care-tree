"use strict";

var express = require("express");
var mustache = require("mustache-express");
const cookieSession = require("cookie-session");
const { body, validationResult } = require("express-validator");

var model = require("./model");
var app = express();
app.use(express.static('public'));

app.use(
  cookieSession({
    name: "session",
    secret: "bGtrZ8a5gh6e58g75dgd47zVZDsH75FSsa5"
  })
);


function update_locals(req, res, next) {
  if (req.session.name) {
    res.locals.authenticated = true;
    res.locals.name = req.session.name;
  }
  return next();
}
app.use(update_locals);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("html", mustache());
app.set("view engine", "html");
app.set("views", __dirname + "/views");



function is_authenticated(req, res, next) {
  if (req.session.name) {
    return next();
  }
  res.render("login");
}


/**** Routes pour voir les pages du site ****/

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/challenges", (req, res) => {
  let found = model.getChallenges(req.query.page, req.session.name);
  res.render("challenges", found);
});

app.get("/acceptedChallenges", is_authenticated, (req, res) => {
  let acceptedChallenges = model.getAcceptedChallenges(req.query.page, req.session.name);
  res.render("acceptedChallenges", acceptedChallenges);
});

app.get("/succeededChallenges", is_authenticated, (req, res) => {
  let succeededChallenges = model.getSucceededChallenges(req.query.page, req.session.name);
  res.render("succeededChallenges", succeededChallenges);
});

app.get("/createdChallenges", is_authenticated, (req, res) => {
  let createdChallenges = model.getCreatedChallenges(req.query.page, req.session.name);
  res.render("createdChallenges", createdChallenges);
});

app.get("/profile", (req,res) => {
  let avatar = model.getProfilePicURL(req.session.name);
  if(avatar != null) res.render("profile", {avatar : avatar});
  else res.render("profile");
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/createChallenge", 
         is_authenticated,(req, res) => {
  res.render("createChallenge");
});

app.get("/tree", is_authenticated,
        (req,res) =>{
  let treePic = model.getTree(req.session.name);
  let nbPoints = model.getPoints(req.session.name);
  let filling = nbPoints*100/2000;
  res.render("tree", {treePic : treePic, nbPoints : nbPoints, filling : filling });
  
});

app.get("/acceptChallenge/:id", is_authenticated, (req, res) => {
  let success = model.acceptChallenge(req.session.name, req.params.id);
  let acceptedChallenges = model.getAcceptedChallenges(req.query.page, req.session.name);
  if (success) acceptedChallenges.success = {msg : "Défi accepté !"};
  res.render("acceptedChallenges", acceptedChallenges);
});

app.get("/endChallenge/:id", is_authenticated, (req, res) => {
  let success = model.endChallenge(req.session.name, req.params.id);
  let succeededChallenges = model.getSucceededChallenges(req.query.page, req.session.name);
  if (success) succeededChallenges.success = {msg : "Bravo, défi terminé !"};
  res.render("succeededChallenges", succeededChallenges);
});

app.get("/abandonChallenge/:id", is_authenticated, (req, res) => {
  let success = model.abandonChallenge(req.session.name, req.params.id);
  let acceptedChallenges = model.getAcceptedChallenges(req.query.page, req.session.name);
  if (success) acceptedChallenges.info = {msg : "Défi abandonné"};
  res.render("acceptedChallenges", acceptedChallenges);
});

app.get("/delChallenge/:id", is_authenticated, (req, res) => {
  let success = model.delChallenge(req.session.name, req.params.id);
  let succeededChallenges = model.getSucceededChallenges(req.query.page, req.session.name);
  if (success) succeededChallenges.info = {msg : "Défi supprimé"};
  res.render("succeededChallenges", succeededChallenges);
});

app.get("/upvote/:id", is_authenticated, (req, res) => {
  let success = model.upvoteChallenge(req.session.name, req.params.id);
});

//////////////////////////////////////////////////////////////////////////////////


app.post("/login", (req, res) => {
  let username = model.login(req.body.username, req.body.password);
  if (username == null) {
    res.render("login", {errors : {msg : "Nom d'utilisateur ou mot de passe erroné"}});
  } else {
    req.session.name = req.body.username;
    res.redirect("/");
  }
});

app.post("/signup", 
         //body("email").isEmail(),
         body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire au moins 8 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins 1 chiffre'),
         body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe de correspondent pas.');
    }
    return true;
  }),
         (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    let new_username = model.new_user(req.body.username, req.body.password, req.body.avatar);
    if (new_username != null) {
      req.session.name = req.body.username;
      res.redirect("/");
    } else{
      res.render("signup", {errors : {msg : "Nom d'utilisateur déjà pris"}});
    }
  }else {
    res.render("signup", {errors : errors.array()});
  }
});

app.post("/edit_profile", 
         //body("email").isEmail(),
         body("oldPassword").custom((value, { req }) => {
    if (model.login(req.session.name, value) == null) {
      throw new Error('Mot de passe erroné');
    }
    return true;
  }),
         body('newPassword')
         .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire au moins 8 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins 1 chiffre'),
         body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Les mots de passe de correspondent pas.');
    }
    return true;
  }),
         (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    let edit = model.edit_user_infos(req.session.name, req.body.newPassword);
    if (edit != -1) {
      let avatar = model.getProfilePicURL(req.session.name);
      if(avatar != null) res.render("profile", {avatar : avatar , success : {msg: "Informations modifiées !"}});
      else res.render("profile", {success : {msg: "Informations modifiées !"}});
    } else{
      res.render("profile", {errors : errors.array()});
    }
  }else {
    res.render("profile", {errors : errors.array()});
  }
});

app.post("/edit_profile_pic", (req, res) => {
  let edit = model.edit_profilePic(req.session.name, req.body.avatar);
    if (edit != -1) {
      res.render("profile", {avatar : req.body.avatar, success : {msg: "Avatar modifié !"}});
    } else{
      res.render("profile", {errors : {msg: "Il y a une erreur"}});
    }
})

app.post("/createChallenge", (req, res) => {
  model.createChallenge(req.session.name, req.body.title, req.body.description)
  res.render("createChallenge", {success : {msg: "Votre défi a été créé !"}})
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

/**** Routes pour modifier les données ****/

app.listen(3000, () => console.log("listening on http://localhost:3000"));
