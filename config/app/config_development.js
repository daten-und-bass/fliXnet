'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: process.env.NODE_ENV,
      directory: process.env.DUNDB_APP_ENV_SECS_DIR,
      file:process.env.DUNDB_APP_ENV_SECS_FILE,
    };
    console.log(process.env.DUNDB_APP_ENV_SECS_DIR);
    return environment;
  },

  web: function() {
    var web = {
      ip: process.env.DUNDB_APP_ENV_S2_WB1_IRME_IP1, // not used
      http: {
        port: process.env.DUNDB_APP_ENV_S2_WB1_IRME_HTTP_PORT, // not used
      },
      https: {
        port: process.env.DUNDB_APP_ENV_S2_WB1_IRME_HTTPS_PORT,
        crt: '/etc/ssl/' + process.env.DUNDB_APP_ENV_S2_WB1_IRME_HTTPS_CERT1,
        key: '/etc/ssl/' + process.env.DUNDB_APP_ENV_S2_WB1_IRME_HTTPS_CERT1_KEY,
      },
    };

    return web;
  },

  db: function() {
    var db = {
      ip: process.env.DUNDB_APP_ENV_S3_DB1_BKED_IP1,
      headers: {
        Authorization: process.env.FLIXNET_DB_PASS,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=UTF-8',
      },
      http: {
        port: process.env.DUNDB_APP_ENV_S3_DB1_BKED_HTTP_PORT,
      },
      https: {
        port: process.env.DUNDB_APP_ENV_S3_DB1_BKED_HTTPS_PORT,
        ca: '/etc/ssl/' + process.env.DUNDB_INF_ENV_PKI1_CA_CERT,
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
  var file = appConfig.environment().directory.toString() + appConfig.environment().file.toString();

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

  fs.unlinkSync(file)
  fs.rmdirSync(appConfig.environment().directory.toString());
})();

(function loadOtherFiles () {
  process.env.WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  // process.env.FLIXNET_WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  process.env.WEB_HTTPS_CRT = fs.readFileSync(appConfig.web().https.crt, 'utf8');
  // process.env.FLIXNET_WEB_HTTPS_CRT = fs.readFileSync(appConfig.web().https.crt, 'utf8');
  process.env.DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');
  // process.env.FLIXNET_DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');

  fs.unlinkSync(appConfig.web().https.key)  
})();

module.exports = appConfig;
