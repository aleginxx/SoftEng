const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DB = require('./endpoints/database.js');
const http = require('http');
const phpExpress = require('php-express')();
const { exec } = require('child_process');

const port = 9876;
const app = express();

const base_url = '/ntuaflix_api';

// Set up multer for handling file uploads
const upload = multer({
  dest: 'uploads/', // Destination folder for uploaded files
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext.toLowerCase() !== '.tsv') {
      return cb(new Error('Only TSV files are allowed'));
    }
    cb(null, true);
  },
});

app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.set('views', path.join(__dirname, '..', 'front-end'));

// Serve PHP files
app.all(/.+\.php$/, phpExpress.router);

// Serve other static files
app.use(express.static(path.join(__dirname, '..', 'front-end')));

app.use(base_url, express.static(path.join(__dirname, 'front-end')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const phpPath = "C:\\tools\\php83\\php.exe"
  const filePath = path.join(__dirname, '..', 'front-end', 'index.php');

  // Execute PHP file
  const command = `"${phpPath}" "${filePath}"`;
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error executing PHP file: ${error.message}`);
          return res.status(500).send('Internal Server Error');
      }
      res.send(stdout);
  });
});

/* GET Methods */
const healthcheck = require('./endpoints/healthcheck.js');
app.use(base_url, healthcheck);

const title = require('./endpoints/title.js');
app.use(base_url, title);

const searchtitle = require('./endpoints/searchtitle.js');
app.use(base_url, searchtitle);

const bygenre = require('./endpoints/bygenre.js');
app.use(base_url, bygenre);

const name = require('./endpoints/name.js');
app.use(base_url, name);

const searchname = require('./endpoints/searchname.js');
app.use(base_url, searchname);

/* FUNCTIONAL GET Methods */
const bestRatedTitles = require('./endpoints/functional endpoints/get_best_rated_titles.js');
app.use(base_url, bestRatedTitles);

const highestRatedByPrincipal = require('./endpoints/functional endpoints/get_highest_rated_title_by_principal.js');
app.use(base_url, highestRatedByPrincipal);

const highestRatedByActor = require('./endpoints/functional endpoints/get_highest_rated_title_by_actor.js');
app.use(base_url, highestRatedByActor);

const mostRecentFilm = require('./endpoints/functional endpoints/get_most_recent_film.js');
app.use(base_url, mostRecentFilm);

const topRatedPrincipals = require('./endpoints/functional endpoints/get_top_rated_principals.js');
app.use(base_url, topRatedPrincipals);

const topGenresByPrincipal = require('./endpoints/functional endpoints/get_top_genres_by_principal.js');
app.use(base_url, topGenresByPrincipal);

const userSeenTitles = require('./endpoints/functional endpoints/get_user_seen_titles.js');
app.use(base_url, userSeenTitles);

const userGenrePercentage = require('./endpoints/functional endpoints/user_genre_percentage.js');
app.use(base_url, userGenrePercentage);

/* POST Methods */
const login = require('./endpoints/login.js');
app.use(base_url, login);

const signup = require('./endpoints/signup.js');
app.use(base_url, signup);

const upload_titlebasics = require('./endpoints/upload_titlebasics.js');
app.use(base_url, upload_titlebasics);

const upload_titleakas = require('./endpoints/upload_titleakas.js');
app.use(base_url, upload_titleakas);

const upload_namebasics = require('./endpoints/upload_namebasics.js');
app.use(base_url, upload_namebasics);

const upload_titlecrew = require('./endpoints/upload_titlecrew.js');
app.use(base_url, upload_titlecrew);

const upload_titleepisode = require('./endpoints/upload_titleepisode.js');
app.use(base_url, upload_titleepisode);

const upload_titleprincipals = require('./endpoints/upload_titleprincipals.js');
app.use(base_url, upload_titleprincipals);

const upload_titleratings = require('./endpoints/upload_titleratings.js');
app.use(base_url, upload_titleratings);

const upload_all = require('./endpoints/upload_all.js');
app.use(base_url, upload_all);

const reset_all = require('./endpoints/resetall.js');
app.use(base_url, reset_all);

const usermod = require('./endpoints/usermod.js');
app.use(base_url, usermod);

const users = require('./endpoints/users.js');
app.use(base_url, users);

/* FUNCTIONAL POST Methods */
const rateTitle = require('./endpoints/functional endpoints/rate_title.js');
app.use(base_url, rateTitle);

const addSeenTitle = require('./endpoints/functional endpoints/add_seen_title.js');
app.use(base_url, addSeenTitle);

const deleteSeenTitle = require('./endpoints/functional endpoints/delete_seen_title.js');
app.use(base_url, deleteSeenTitle);

const addToFavorites = require('./endpoints/functional endpoints/add_to_favorites.js');
app.use(base_url, addToFavorites);

const deleteFromFavorites = require('./endpoints/functional endpoints/delete_from_favorites.js');
app.use(base_url, deleteFromFavorites);

const createUser = require('./endpoints/functional endpoints/create_user.js');
app.use(base_url, createUser);

const logout = require('./endpoints/logout.js');
app.use(base_url, logout);

const deleteUser = require('./endpoints/functional endpoints/delete_user.js');
app.use(base_url, deleteUser);

const emailVerification = require('./endpoints/functional endpoints/email_verification.js');
app.use(base_url, emailVerification);



app.get('/movies', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'movies.php');
  res.sendFile(filePath);
});

app.get('/series', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'series.php');
  res.sendFile(filePath);
});

app.get('/user', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'user.php');
  res.sendFile(filePath);
});

app.get('/profile', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'profile.php');
  res.sendFile(filePath);
});

app.get('/movie_details', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'movie_details.php');
  res.sendFile(filePath);
});

app.get('/principals', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'principals.php');
  res.sendFile(filePath);
});

app.get('/principal_details', (req, res) => {
  const filePath = path.join(__dirname, '..', 'front-end', 'principal_details.php');
  res.sendFile(filePath);
});

http.createServer(app).listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});
