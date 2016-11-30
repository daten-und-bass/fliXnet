'use strict';

var LocalStrategy = require('passport-local').Strategy;

var passport = function(passport, userDB) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, {id: id});
  });

  passport.use('local-register', new LocalStrategy(userDB.usersConfig.auth.local.passport.options, function(req, user, password, done) {

    var userObject = {
      fullname: req.swagger.params.fullname.value,
      birth: req.swagger.params.birth.value,
      email: req.swagger.params.email.value,
      password: password,
      auth: userDB.usersConfig.auth.local.type,
    };

    userDB.save(user, userObject, function (err, exists) {

      if(err) { return done(err); }

      if(exists) {
        return done(null, false, { message: 1 }); // hint via message that already taken
      } else {
        return done(null, {id: userDB.krypto.encryptUserName(user, userDB.usersConfig.secret)}, { message: 'Welcome to fliXnet.' });
      }
    });
  }));

  passport.use('local-login', new LocalStrategy(userDB.usersConfig.auth.local.passport.options, function(req, user, password, done) {

    userDB.authenticate(user, password, function(err, exists, verify) {

      if(err) { return done(err); }
  
      if(exists && verify) {
        return done(null, {id: userDB.krypto.encryptUserName(user, userDB.usersConfig.secret)});
      } else if(exists && !verify) {
        return done(null, false, { message: 2 });
      } else if(!exists) {
        return done(null, false, { message: 3 });
      } else {
        return done(null, false, { message: 4 });
      }
    });      
  }));
};

module.exports = passport;
