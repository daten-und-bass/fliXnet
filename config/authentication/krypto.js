'use strict';

var crypto = require('crypto');

var krypto = function (kryptoConfig) {

  return {

    encryptUserName: function(user, secret) {
      var cipher = crypto.createCipher('aes192', secret);

      var encrypted = cipher.update(user, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return encrypted;
    },

    decryptUserName: function(userEcrypted, secret) {
      var cipher = crypto.createDecipher('aes192', secret);

      var decrypted = cipher.update(userEcrypted, 'hex', 'utf8');
      decrypted += cipher.final('utf8');
      
      return decrypted;
    },

    hashUser: function(user, callback) {
      var secret = kryptoConfig.secret; 

      crypto.pbkdf2(user, secret, kryptoConfig.options.iterations, kryptoConfig.options.hashBytes, function(err, userHash) {

        if (err) { return callback(err); }

        var userKey = Buffer.alloc(userHash.length + 4);

        userKey.writeUInt32BE(kryptoConfig.options.iterations, 0, true);
        userHash.copy(userKey, 4);

        return callback(null, userKey);
      });
    },
    
    hashPassword: function (password, callback) {

      crypto.randomBytes(kryptoConfig.options.saltBytes, function(err, salt) {
        
        if (err) { return callback(err); }

        crypto.pbkdf2(password, salt, kryptoConfig.options.iterations, kryptoConfig.options.hashBytes, function(err, passwordHash) {

          if (err) { return callback(err); }

          var passwordValue = Buffer.alloc(passwordHash.length + salt.length + 8);

          passwordValue.writeUInt32BE(salt.length, 0, true);
          passwordValue.writeUInt32BE(kryptoConfig.options.iterations, 4, true);

          salt.copy(passwordValue, 8);
          passwordHash.copy(passwordValue, salt.length + 8);

          return callback(null, passwordValue);
        });
      });
    },

    verifyPassword: function(password, storedPasswordValue, callback) {
      var saltBytes = storedPasswordValue.readUInt32BE(0);
      var hashBytes = storedPasswordValue.length - saltBytes - 8;
      var iterations = storedPasswordValue.readUInt32BE(4);
      var salt = storedPasswordValue.slice(8, saltBytes + 8);
      var hash = storedPasswordValue.toString('binary', saltBytes + 8);

      crypto.pbkdf2(password, salt, iterations, hashBytes, function(err, verify) {
        if (err) { return callback(err); }

        if (verify.toString('binary') === hash) {
          return callback(null, true);
        } else {
          return callback(null, false);
        }
      });
    },
  };
};

module.exports = krypto;