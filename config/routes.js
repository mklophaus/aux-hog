var express     = require('express'),
    router      = new express.Router(),
    querystring = require('querystring'),
    passport    = require('passport'),
    Circle      = require('../models/circle');

// Require controllers.
var welcomeController = require('../controllers/welcome');
var circlesController = require('../controllers/circles');
var usersController   = require('../controllers/users');
var apiController     = require('../controllers/api');
var spotify           = require('../config/spotifyApiHelper');


// =============Root Path==============
// ====================================
router.get('/', welcomeController.index);

// =============API Routes=============
// ====================================
router.get('/api/circles', isLoggedIn, circlesController.index);
router.get('/api/circles/:id', isLoggedIn, circlesController.showCircle);
router.get('/api/users', isLoggedIn, usersController.index);
router.get('/api/me', usersController.currentUser);
// router.get('/api/users/:id/circles', usersController.userCircles);

// =============App Routes=============
// ====================================
router.delete('/circles/:id', isLoggedIn, circlesController.destroyCircle);
router.get('/updateCircle', isLoggedIn, circlesController.updateCircle);
router.post('/circles', isLoggedIn, circlesController.createCircle);
router.get('/testLib', isLoggedIn, function(req,res) {
    spotify.buildStation(req.query.disId, req.user.accessToken).
      then(function(station) {
        res.json(station);
        console.log(station);
      }).
      then(function(){
        console.log('hey bu')
        console.log()
        res.redirect('/')
      });
});
router.get('/postPlaylist', isLoggedIn, function(req,res) {
  // eval(locus);
  spotify.savePlaylist(req.user.spotifyId, req.user.accessToken, req.query.title, req.query.tracks).
    then(function(playlist) {
      console.log("squish");
      res.json(playlist);
      console.log(playlist);
    }).
    then(function() {
      console.log('ay bae')
      console.log()
      res.redirect('/')
    })
});

router.get('/libraries', isLoggedIn, function(req, res) {
  var spotify = require('./spotifyApiHelper');
  var Circle = require('../models/circle');
  Circle.find({}, function(err, circles) {
    var libraries = spotify.buildLibraries(circles[0].id, req.user.accessToken);
    res.json(libraries);
  });
});


// ============Spotify Login===========
// ====================================
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';


  // router.get('/', function(req,res){
  //   res.render('index', { title: "WELCOME TO BOOMSQUAD!"});

  // });

// router.get('/login',
//   passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private']});
//      // The request will be redirected to spotify for authentication, so this
//      // function will not be called.

//     // var state = generateRandomString(16);
//     // res.cookie(stateKey, state);

//     // // your application requests authorization
//     // var scope = 'user-read-private user-read-email';
//     // res.redirect('https://accounts.spotify.com/authorize?' +
//     //   querystring.stringify({
//     //     response_type: 'code',
//     //     client_id: process.env.CLIENT_ID,
//     //     scope: scope,
//     //     redirect_uri: 'https://piradio.herokuapp.com/callback',
//     //     state: state
//     //   }));
// });


router.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private'], showDialog: true }),
  function(req, res){
   // The request will be redirected to spotify for authentication, so this
   // function will not be called.
});

router.get('/login',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private']}),
  function(req, res){
   // The request will be redirected to spotify for authentication, so this
   // function will not be called.
});


router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
