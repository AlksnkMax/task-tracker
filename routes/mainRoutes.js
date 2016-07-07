var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
  if(!req.isAuthenticated()) {
     res.sendfile('./public/sign.html');
  } else {

     var user = req.user;

     if(user !== undefined) {
        user = user.toJSON();
     }
     res.sendfile('./public/app.html');
  }
});

router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
    res.send(req.user);
});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.send(req.user);
});

module.exports = router;
