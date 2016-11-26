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

// var client = redis.createClient(6379, '192.168.103.21', {db: 1, prefix:'fliXnet:users', return_buffers: true, auth_pass: "helloworld"});

// var config = {
//   hashBytes: 32,
//   saltBytes: 16,
//   iterations: 872791
// };

// var secret = Buffer.from('secret123456');

// var userBasicAuth = {

//   findUser: function (user, callback)  {
//     userBasicAuth.hashUser(user, secret, function (err, userKey) {

//       if (err) { return callback(err); }

//       client.exists(userKey.toString('utf8'), function(error, exists) {

//         if (parseInt(exists.toString('utf-8')) === 1 ) {

//           return callback(err, {id:userKey, username: user});
//         } else {

//           return callback(err, false);
//         }
//       });
//     });
//   },

//   getUser: function (user, callback)  {
//     userBasicAuth.hashUser(userBasicAuth.decryptUserName(user, secret), secret, function (err, userKey) {
//       client.hgetall(userKey.toString('utf8'), function(err, userObject) {
//         console.log(userObject);
//         userObject.user = userBasicAuth.decryptUserName(user, secret);
//         callback(err, userObject);
//       });
//     });
//   },

//   // saveUser: function (user, password, callback)  {
//   saveUser: function (user, userObject, callback)  {

//     userBasicAuth.hashUser(user, secret, function (err, userKey) {
//       // userBasicAuth.hashPassword(password, function (err, passwordValue) {
//       userBasicAuth.hashPassword(userObject.password, function (err, passwordValue) {  

//         if (err) { return callback(err); }

//         client.exists(userKey, function(error, exists) {


//           if (parseInt(exists.toString('utf-8')) === 1 ) {

//             return callback(err, parseInt(exists.toString('utf-8')));
//           } else {
//             // client.set(userKey, passwordValue, function(err, reply) {
//             //   return callback(err, exists, userKey, passwordValue);
//             client.hmset(userKey.toString('utf8'), {
//               'user': userBasicAuth.encryptUserName(user, secret),
//               // 'authType': 'localAuth',
//               'fullname': userObject['fullname'],
//               'birth': userObject['birth'],
//               'email': userObject['email'],
//               'password': passwordValue,
//             }, function(err, reply) {
//                 console.log(userKey.toString('utf8'));
//                 console.log(userKey);
//                 return callback(err, exists, userKey, passwordValue);
//             });
//           }
//         });
//       });
//     });
//   },

//   updateUser: function (user, userObject, callback)  {

//     userBasicAuth.hashUser(userBasicAuth.decryptUserName(user, secret), secret, function (err, userKey) {

//       if (err) { return callback(err); }

//       client.exists(userKey.toString('utf8'), function(error, exists) { 

//         if (err) { return callback(err); }

//         if (parseInt(exists.toString('utf-8')) === 1 ) {
//           client.hgetall(userKey.toString('utf8'), function(err, userObjectOld) {
//             userBasicAuth.verifyPassword(userObject.password, userObjectOld.password, function (err, verify) {
              
//               if (err) { return callback(err); }  
                
//               if (verify) {

//                 if(userObject.passwordNew) {
//                   userBasicAuth.hashPassword(userObject.passwordNew, function (err, passwordValue) { 

//                     if (err) { return callback(err); } 

//                     delete userObject.password;
//                     delete userObject.passwordNew;
//                     userObject.password = passwordValue;

//                     client.hmset(userKey.toString('utf8'), userObject, function(err, reply) {

//                       if (err) { return callback(err); } 

//                       return callback(null, true);
//                     });
//                   });
//                 } else {

//                   delete userObject.password;
//                   delete userObject.passwordNew;

//                   client.hmset(userKey.toString('utf8'), userObject, function(err, reply) {

//                     if (err) { return callback(err); } 

//                     return callback(null, true);
//                   });
//                 }
//               } else {

//                 return callback(null, false);
//               }
//             });
//           });
//         } else {

//           return callback(null, false);
//         }
//       });
//     });
//   },

//   deleteUser: function (user, callback)  {

//     userBasicAuth.hashUser(userBasicAuth.decryptUserName(user, secret), secret, function (err, userKey) {
//       client.del(userKey.toString('utf8'), function (err, reply) {
        
//         if (err) { return callback(err); } 

//         if (parseInt(reply.toString('utf-8')) === 1) {

//           return callback(null, true);
//         } else {

//           return callback(null, false);
//         }
//       })
//     });  
//   },

//   authenticateUser: function (user, password, callback) {

//     userBasicAuth.hashUser(user, secret, function (err, userKey) {

//       console.log('hashUser: ' + userKey);
//       console.log('hashUser: ' + userKey.toString('utf8'));

//       if (err) { return callback(err); }

//       client.hgetall(userKey.toString('utf8'), function(err, userObject) {
//         console.log(Buffer.isBuffer(userObject.password));
//         userBasicAuth.verifyPassword(password, userObject.password, function (err, verify) {
//           callback(err, verify, userKey, userObject.password);
//         });
//       });
//     });    
//   },

//   encryptUserName: function (user, secret) {
//     var cipher = crypto.createCipher('aes192', secret);

//     var encrypted = cipher.update(user, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
    
//     return encrypted;
//   },

//   decryptUserName: function (userEcrypted, secret) {
//     var cipher = crypto.createDecipher('aes192', secret);

//     var decrypted = cipher.update(userEcrypted, 'hex', 'utf8');
//     decrypted += cipher.final('utf8');
    
//     return decrypted;
//   },

//   hashUser: function (user, secret, callback) {

//     crypto.pbkdf2(user, secret, config.iterations, config.hashBytes, function(err, userHash) {

//       if (err) { return callback(err); }

//       var userKey = Buffer.alloc(userHash.length + 4);

//       userKey.writeUInt32BE(config.iterations, 0, true);
//       userHash.copy(userKey, 4);

//       callback(null, userKey);
//     });
//   },

//   hashPassword: function (password, callback) {

//     crypto.randomBytes(config.saltBytes, function(err, salt) {
      
//       if (err) { return callback(err); }

//       crypto.pbkdf2(password, salt, config.iterations, config.hashBytes, function(err, passwordHash) {

//         if (err) { return callback(err); }

//         var passwordValue = Buffer.alloc(passwordHash.length + salt.length + 8);

//         passwordValue.writeUInt32BE(salt.length, 0, true);
//         passwordValue.writeUInt32BE(config.iterations, 4, true);

//         salt.copy(passwordValue, 8);
//         passwordHash.copy(passwordValue, salt.length + 8);

//         callback(null, passwordValue);
//       });
//     });
//   },

//   verifyPassword: function(password, combined, callback) {
//     var saltBytes = combined.readUInt32BE(0);
//     var hashBytes = combined.length - saltBytes - 8;
//     var iterations = combined.readUInt32BE(4);
//     var salt = combined.slice(8, saltBytes + 8);
//     var hash = combined.toString('binary', saltBytes + 8);

//     crypto.pbkdf2(password, salt, iterations, hashBytes, function(err, verify) {
//       if (err) {
//         return callback(err, false);
//       }

//       callback(null, verify.toString('binary') === hash);
//     });
//   },
// };

// module.exports = {
//   users: users,
//   client: client,
//   userBasicAuth: userBasicAuth,
// };






