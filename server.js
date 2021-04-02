"use strict"

var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

var model = require('./model');
var app = express();


function update_locals(req, res, next) {
  console.log("running middleware");
  console.log(req.session.name);
  if(req.session.name) {
    console.log("updating locals");
    res.locals.authenticated = true;
    res.locals.name = req.session.username;
  }
  return next();
}


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//TODO: random secret
app.use(cookieSession({
  secret:'bGtrZ8a5gh6e58g75dgd47zVZDsH75FSsa5',
}));
app.use(update_locals);

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

function is_authenticated(req, res, next) {
  console.log("is the user authenticated?")
  if(req.session.name != null) {
    console.log("yes")
    return next();
  }
  console.log("no")
  res.status(401).send('Authentication required');
}

/**** Routes pour voir les pages du site ****/


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/challenges', (req, res) => {
  var found = model.getChallenges(req.query.page);
  res.render('challenges', found);
});

//////////////////////////////////////////////////////////////////////////////////


app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/signup', (req, res) => {
  res.render('signup');
})

app.post('/login', (req, res) => {
  let username = model.login(req.body.username, req.body.password);
  if (username == null) {
    res.redirect('/login');
  } else {
    req.session.name = req.body.username;
    res.redirect('/');
  }
})

app.post('/signup', (req, res) => {
  let id = model.new_user(req.body.username, req.body.password);
  if (id != undefined) {
    req.session.username = req.body.username;
    req.session.user = id;
    res.redirect('/');
  } else {
    res.redirect('/new_user');
  }
})

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

/**** Routes pour modifier les données ****/

app.listen(3000, () => console.log('listening on http://localhost:3000'));


