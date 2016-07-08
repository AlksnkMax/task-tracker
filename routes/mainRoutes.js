var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
  if(!req.isAuthenticated()) {
     res.redirect('/login');
  } else {
    var user = req.user;
    if(user !== undefined) {
        user = user.toJSON();
    }
    res.sendfile('./public/app.html');
  }
});

router.post('/signup', passport.authenticate('local-signup', { successRedirect: '/',
                          failureRedirect: '/signup'}), function(req, res) {
  res.send(req.user);
});

router.get('/signup', function(req, res) {
  if(req.isAuthenticated()) {
     res.redirect('/');
  }
  res.sendfile('./public/signup.html');
});

router.get('/login', function(req, res) {
  if(req.isAuthenticated()) {
     res.redirect('/');
  }
  res.sendfile('./public/login.html');
});

router.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                          failureRedirect: '/login'}), function(req, res) {
  res.send(req.user);
});

router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
