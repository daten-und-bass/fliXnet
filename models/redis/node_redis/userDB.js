'use strict';

var redis = require('redis');

var userDB = function() {

  var that = this;

  var redisClient = redis.createClient(that.usersConfig.store.port, that.usersConfig.store.host, that.usersConfig.store.options);
  
  redisClient.on('connect', function() {
    redisClient.select(parseInt(that.usersConfig.store.options.db));
  });

  redisClient.on('error', function (err) {
      console.log('Error ' + err);
  });

  return {
    usersConfig: that.usersConfig,
    krypto: that.krypto,
    check: function(user, callback)  {
      that.krypto.hashUser(user, function(err, userKey) {

        if (err) { return callback(err); }

        redisClient.exists(userKey.toString('utf8'), function(error, exists) {

          if (err) { return callback(err); }

          if (parseInt(exists.toString('utf-8')) === 1 ) {
            return callback(null, true);
          } else {
            return callback(null, false);
          }
        });
      });
    },

    get: function(user, callback)  {
      var decryptedUser = that.krypto.decryptUserName(user, that.usersConfig.secret);

      that.krypto.hashUser(decryptedUser, function(err, userKey) {

        if (err) { return callback(err); }

        redisClient.hgetall(userKey.toString('utf8'), function(err, userObject) {

          if (userObject) {
            userObject.user = decryptedUser;
            delete userObject.password;

            return callback(null, userObject);
          } else {
            return callback(null, false);
          }
        });
      });
    },

    save: function(user, userObject, callback)  {

      that.krypto.hashUser(user, function (err, userKey) {

        if (err) { return callback(err); }

        that.krypto.hashPassword(userObject.password, function (err, passwordValue) {  

          if (err) { return callback(err); }

          delete userObject.user;
          userObject.user = that.krypto.encryptUserName(user, that.usersConfig.secret);
          delete userObject.password;
          userObject.password = passwordValue;

          redisClient.exists(userKey.toString('utf8'), function(error, exists) {

            if (err) { return callback(err); }

            var isUserKeyTaken = parseInt(exists.toString('utf-8')) === 1 ? true : false;

            if (isUserKeyTaken) {
              return callback(null, isUserKeyTaken);
            } else {
              redisClient.hmset(userKey.toString('utf8'), userObject, function(err, reply) {

                if (err) { return callback(err); }
                
                if (reply.toString('utf-8') === 'OK') {
                  return callback(null, isUserKeyTaken); //userKey, passwordValue or reply?? 
                } else {
                  return callback(null, isUserKeyTaken); // reply 
                }
              });
            }
          });
        });
      });
    },

    update: function (user, userObject, callback)  {

      that.krypto.hashUser(that.krypto.decryptUserName(user, that.usersConfig.secret), function (err, userKey) {

        if (err) { return callback(err); }

        redisClient.exists(userKey.toString('utf8'), function(error, exists) { 

          if (err) { return callback(err); }

          if (parseInt(exists.toString('utf-8')) === 1 ) {
            redisClient.hgetall(userKey.toString('utf8'), function(err, userObjectOld) {

              if (err) { return callback(err); }

              that.krypto.verifyPassword(userObject.password, userObjectOld.password, function (err, verify) {
                
                if (err) { return callback(err); }  
                  
                if (verify) {

                  if(userObject.passwordNew) {
                    that.krypto.hashPassword(userObject.passwordNew, function (err, passwordValue) { 

                      if (err) { return callback(err); } 

                      delete userObject.password;
                      delete userObject.passwordNew;
                      userObject.password = passwordValue;

                      redisClient.hmset(userKey.toString('utf8'), userObject, function(err, reply) {

                        if (err) { return callback(err); } 

                        if (reply.toString('utf-8') === 'OK') {
                          return callback(null, true); //userKey, passwordValue or reply?? 
                        } else {
                          return callback(null, false); // reply
                        }
                      });
                    });
                  } else {

                    delete userObject.password;

                    redisClient.hmset(userKey.toString('utf8'), userObject, function(err, reply) {

                      if (err) { return callback(err); }

                      if (reply.toString('utf-8') === 'OK') {
                        return callback(null, true); //userKey, passwordValue or reply?? 
                      } else {
                        return callback(null, false); // reply
                      }
                    });
                  }
                } else {
                  return callback(null, false);
                }
              });
            });
          } else {
            return callback(null, false);
          }
        });
      });
    },

    delete: function (user, callback)  {

      that.krypto.hashUser(that.krypto.decryptUserName(user, that.usersConfig.secret), function (err, userKey) {

        if (err) { return callback(err); }

        redisClient.del(userKey.toString('utf8'), function (err, reply) {
          
          if (err) { return callback(err); } 

          if (parseInt(reply.toString('utf-8')) === 1) {
            return callback(null, true);
          } else {
            return callback(null, false);
          }
        });
      });  
    },

    authenticate: function (user, password, callback) {

      that.krypto.hashUser(user, function (err, userKey) {

        if (err) { return callback(err); }

        redisClient.exists(userKey.toString('utf8'), function(error, exists) {

          if (parseInt(exists.toString('utf-8')) === 1 ) {
            redisClient.hgetall(userKey.toString('utf8'), function(err, userObject) {

              if (err) { return callback(err); }

              console.log(userObject.auth);
              console.log(that.usersConfig);
              console.log(that.usersConfig.auth.local.type);
              switch (userObject.auth.toString('utf-8')){
                case that.usersConfig.auth.local.type:
                  that.krypto.verifyPassword(password, userObject.password, function (err, verify) {

                    if(verify) {
                      return callback(null, true, true); //, userKey, userObject.password
                    } else {
                      return callback(null, true, false);
                    }
                  });
                  break;
                // case oauth:

                //   break;
                default:
                  console.log("Default case");
              }
            });
          } else {
            return callback(null, false, false);
          }
        });
      }); 
    },
  };
};

module.exports = userDB;






