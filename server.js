"use strict";

var express = require("express");
var mustache = require("mustache-express");
const cookieSession = require("cookie-session");
const { body, validationResult } = require("express-validator");

var model = require("./model");
var app = express();

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
  let found = model.getChallenges(req.query.page);
  res.render("challenges", found);
});

app.get("/challenges", (req, res) => {
  let found = model.getAcceptedChallenges(req.query.page, req.session.name);
  res.render("challenges", found);
});

//////////////////////////////////////////////////////////////////////////////////

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

app.get("/profile", (req,res) => {
  res.render("profile");
})

app.post("/login", (req, res) => {
  let username = model.login(req.body.username, req.body.password);
  if (username == null) {
    res.redirect("/login");
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
    let new_username = model.new_user(req.body.username, req.body.password);
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
