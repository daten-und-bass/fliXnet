'use strict';

var fliXnetOAuthOptions = require('../app/').users().auth.oAuth.volos.options;

var config = {};

config.devRequest = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  userName: 'userName/e-mail',
};

config.appRequest = {
  name: 'fliXnet',
  // scopes: 'write:user write:graph write:movies'
  scopes: 'write:persons'
};


var ManagementProvider = require('volos-management-redis');
var options = {
  encryptionKey : fliXnetOAuthOptions.encryptionKey,
  host: fliXnetOAuthOptions.host,
  port: fliXnetOAuthOptions.port,
  db: fliXnetOAuthOptions.db,
  options: {
    auth_pass: fliXnetOAuthOptions.options.auth_pass
  }
};

var management = ManagementProvider.create(options);

function createDev(cb) {
  management.createDeveloper(config.devRequest, cb); 
}

function createApp(developer, cb) {
  var appRequest = {
    developerId : developer.id,
    name: config.appRequest.name,
    scopes: config.appRequest.scopes
  };

  management.createApp(appRequest, cb);
}

createDev(function(e, developer) {
  console.log("THE DEVELOPER: " + JSON.stringify(developer) + "\n");
  createApp(developer, function(e, result) {
    console.log("THE APP: " + JSON.stringify(result) + "\n");
    console.log("Client ID: " + result.credentials[0].key + "\n");
    console.log("Client Secret: " + result.credentials[0].secret + "\n");
    var key = encodeURIComponent(result.credentials[0].key);
    var secret = encodeURIComponent(result.credentials[0].secret);
    console.log("Obtain access token:  curl -i -X POST http://127.0.0.1:10010/accesstoken -d 'grant_type=client_credentials&client_id=" + key + "&client_secret=" + secret + "'");
    process.exit();
  });
});

// curl -i -X POST http://127.0.0.1:10010/accesstoken -d 'grant_type=client_credentials&client_id=yGOi3rHZG4%2B%2BXdyNhc3O5V8liXkR8RjGNvACn6Kcp5k%3D&client_secret=Mf1JqvSTU%2BEXNhhMgEs6d5JBS%2Bxn5aHbhVWSnq4Y%2FVk%3D

