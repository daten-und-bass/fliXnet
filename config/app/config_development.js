'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: 'development',
      directory: process.env.APP_CONFIG_ENV_DIR,
      file:process.env.APP_CONFIG_ENV_FILE,
    };
    console.log(process.env.APP_CONFIG_ENV_DIR);
    return environment;
  },

  web: function() {
    var web = {
      ip: '192.168.101.1', // not used
      http: {
        port: 10010, // not used
      },
      https: {
        port: 10011,
        key: '/etc/ssl/app1_dev1_s2_wb_1_key.pem',
        crt: '/etc/ssl/app1_dev1_s2_wb_1_pub.pem',
      },
    };

    return web;
  },

  db: function() {
    var db = {
      ip: '192.168.101.11',
      headers: {
        Authorization: process.env.DB_PASS,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=UTF-8',
      },
      http: {
        port: 7474,
      },
      https: {
        port: 7473,
        ca: '/etc/ssl/pki1_dev1_ca_pub.pem',
      },
      request: {
        method: 'POST'  // not used
      },
      batch: {
        job: {
          method: 'POST',
          url:'/cypher',
          id: 0,
        },
      },
    };

    db.https.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/transaction/commit';
    db.batch.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/batch';

    return db;
  },
};

(function loadEnvironmentFile () {
  var env = {};
  var file = appConfig.environment().directory + appConfig.environment().file;

  try {
    env = fs.readFileSync(file, 'UTF-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(function(key) {
      process.env[key] = env[key];
    });
  } catch (err) {
    if(err.code === 'ENOENT') {
      console.log('No .env-file found.');
    } else {
      console.log('Reading .env-file failed.');
    }
    throw (err);
  }
})();

(function loadOtherFiles () {
  var directory = appConfig.environment().directory;
  
  process.env.WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  process.env.WEB_HTTPS_CRT = fs.readFileSync(appConfig.web().https.crt, 'utf8');
  process.env.DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;
