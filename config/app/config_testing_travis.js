'use strict';

var fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var appConfig = {
  environment: function() {
    var environment = {
      name: process.env.NODE_ENV,
      // git: {
      //   commit: process.env.FLIXNET_WEB_REPO_HEAD,
      // },
    };

    return environment;
  },

  web: function() {
    var web = {
      https: {
        port: process.env.FLIXNET_WEB_HTTPS_PORT,
        pub: process.env.HOME + '/' + process.env.FLIXNET_WEB_HTTPS_PUB_PATH,
        key: process.env.HOME + '/' + process.env.FLIXNET_WEB_HTTPS_KEY_PATH,
      },
      proxies: isNaN(parseInt(process.env.FLIXNET_WEB_PROXIES)) ? false : parseInt(process.env.FLIXNET_WEB_PROXIES),
    };

    return web;
  },

  db: function() {
    var db = {
      host: process.env.FLIXNET_DB1,
      headers: {
        Authorization: process.env.FLIXNET_DB1_PASS,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=UTF-8',
      },
      http: {
        port: process.env.FLIXNET_DB1_HTTP_PORT,
      },
      https: {
        port: process.env.FLIXNET_DB1_HTTPS_PORT,
        ca: process.env.HOME + '/' + process.env.FLIXNET_WEB_CA_CERT_PUB_PATH,
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

    db.https.url = 'https://' + db.host  + ':' + db.https.port + '/db/data/transaction/commit';
    db.batch.url = 'https://' + db.host  + ':' + db.https.port + '/db/data/batch';

    return db;
  },

  sessions: function() {
    var sessions = {
      session: {
        options:{
          secret: process.env.FLIXNET_WEB_SESS_SEC,
          name: process.env.FLIXNET_WEB_SESS_NAME,
          resave: false,
          saveUninitialized: false, 
          cookie: { secure: true },
          // genid:
        },
      },
      store: {
        options: {
          host: process.env.FLIXNET_DB2,
          port: process.env.FLIXNET_DB2_PORT,
          db: parseInt(process.env.FLIXNET_DB2_INST1),
          pass: process.env.FLIXNET_DB2_PASS,
          // prefix: 'fliXnet:sessions:',
        },
      },
    };

    return sessions;
  },

  users: function() {
    var users = {
      secret: Buffer.from(process.env.FLIXNET_WEB_USER_SEC),
      store: {
        host: process.env.FLIXNET_DB2,
        port: process.env.FLIXNET_DB2_PORT,
        options: {
          db: parseInt(process.env.FLIXNET_DB2_INST2),
          auth_pass: process.env.FLIXNET_DB2_PASS, 
          return_buffers: true,
          // prefix: 'fliXnet:users:',
        },
      },
      auth: {
        local: {
          type: 'local',
          passport: {
            options: {
              usernameField : 'user',
              passwordField : 'password',
              passReqToCallback : true,
            },
          },
        },
        oAuth: {
          type: 'oAuth',
          volos: {
            options: {
              encryptionKey: process.env.FLIXNET_WEB_OAUT_SEC,
              host: process.env.FLIXNET_DB2,
              port: process.env.FLIXNET_DB2_PORT,
              db: parseInt(process.env.FLIXNET_DB2_INST3),
              options:{
                auth_pass: process.env.FLIXNET_DB2_PASS,
              },
            },
          },
        },
      },
    };

    return users;
  },

  krypto: function() {
    var krypto = {
      secret: Buffer.from(process.env.FLIXNET_WEB_KRYP_SEC),
      options: {
        hashBytes: parseInt(process.env.FLIXNET_WEB_KRYP_HBS),
        saltBytes: parseInt(process.env.FLIXNET_WEB_KRYP_SBS),
        iterations: parseInt(process.env.FLIXNET_WEB_KRYP_ITS),
      },
    };

    return krypto;  
  },
};

(function readPKIFiles() {
  process.env.FLIXNET_WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  process.env.FLIXNET_WEB_HTTPS_PUB = fs.readFileSync(appConfig.web().https.pub, 'utf8');
  process.env.FLIXNET_DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;
