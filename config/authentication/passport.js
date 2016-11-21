
var LocalStrategy   = require('passport-local').Strategy;
// var userDB = require('../../models/redis/node_redis');

// var secret = Buffer.from('secret123456');

// expose this function to our app using module.exports
module.exports = function(passport, userDB) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, {id: id});
  });

  passport.use('local-register', new LocalStrategy({
    usernameField : 'user',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, user, password, done) {
      // userDB.userBasicAuth.findUser(user, function(err, exists) {
      userDB.check(user, function(err, exists) {
        if(err) { return done(err); }

        if(exists) {
          return done(null, false, { message: 'That user name is already taken.' });
        } else {

          var userObject = {
            'fullname': req.swagger.params.fullname.value,
            'birth': req.swagger.params.birth.value,
            'email': req.swagger.params.email.value,
            'password': password,
          }
          console.log(userObject);
          // userDB.userBasicAuth.saveUser(user, userObject, function (err, exists, userKey, passwordValue ) {
          userDB.save(user, userObject, function (err, exists, userKey, passwordValue ) {
            if(err)  { return done(err); }
            // req.session.username = user;
            // return done(null, {id: userDB.userBasicAuth.encryptUserName(user, secret)}, { message: 'Welcome to fliXnet.' });
            return done(null, {id: userDB.krypto.encryptUserName(user, userDB.usersConfig.secret)}, { message: 'Welcome to fliXnet.' });
          });
        }
      });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'user',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, user, password, done) { // callback with email and password from our form

    // userDB.userBasicAuth.findUser(user, function(err, exists) {
    userDB.check(user, function(err, exists) {
      if(err) { return done(err); }

      if(!exists)
          return done(null, false, { message: 'No user found.' }); 

      // userDB.userBasicAuth.authenticateUser(user, password, function(err, verify, userKey, passwordValue) {
      userDB.authenticate(user, password, function(err, verify, userKey, passwordValue) {
        console.log('verify: ' + verify);
        if(verify) {
          req.session.username = user;
          return done(null, {id: userDB.krypto.encryptUserName(user, userDB.usersConfig.secret)});
        } else {
          return done(null, false, { message: 'Oops! Wrong password.' });
        }  
      });      
    });
  }));
};
