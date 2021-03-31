"use strict"

var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

var model = require('./model');
var app = express();


function middleware(req, res, next) {
  if(req.session.user !== undefined) {
    res.locals.authenticated = true;

  } else {
    res.locals.authenticated = false;
  }
  return next();
}


// parse form arguments in POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  secret:'bGtrZ8a5gh6e58g75dgd47zVZDsH75FSsa5',
}));
app.use(middleware);

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

function is_authenticated(req, res, next) {
  if(req.session.user !== undefined) {
    return next();
  }
  res.status(401).send('Authentication required');
}

/**** Routes pour voir les pages du site ****/

/* Retourne une page principale avec le nombre de recettes */
app.get('/', (req, res) => {
  res.render('index');
});

/* Retourne les résultats de la recherche à partir de la requête "query" */
app.get('/search', (req, res) => {
  var found = model.search(req.query.query, req.query.page);
  res.render('search', found);
});

/* Retourne le contenu d'une recette d'identifiant "id" */
app.get('/read/:id', (req, res) => {
  var entry = model.read(req.params.id);
  res.render('read', entry);
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.get('/update/:id', (req, res) => {
  var entry = model.read(req.params.id);
  res.render('update', entry);
});

app.get('/delete/:id', (req, res) => {
  var entry = model.read(req.params.id);
  res.render('delete', {id: req.params.id, title: entry.title});
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/new_user', (req, res) => {
  res.render('new_user');
})

app.post('/login', (req, res) => {
  var id = model.login(req.body.username, req.body.password);
  if (id === -1) {
    res.redirect('/login');
  } else {
    req.session.username = req.body.username;
    req.session.user = id;
    res.redirect('/');
  }
})

app.post('/new_user', (req, res) => {
  let id = model.new_user(req.body.username, req.body.password);
  if (id !== undefined) {
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



app.post('/create', (req, res) => {
  var id = model.create(post_data_to_recipe(req));
  res.redirect('/read/' + id);
});

app.post('/update/:id', (req, res) => {
  var id = req.params.id;
  model.update(id, post_data_to_recipe(req));
  res.redirect('/read/' + id);
});

app.post('/delete/:id', (req, res) => {
  model.delete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => console.log('listening on http://localhost:3000'));


