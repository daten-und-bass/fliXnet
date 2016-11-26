'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: process.env.NODE_ENV,
    };

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
      proxies: [ process.env.DUNDB_INF1_ENV_S1_WF1_FTED_IP1, process.env.DUNDB_APP_ENV_S1_LB1_FTED_IP1 ],
    };

    return web;
  },

  db: function() {
    var db = {
      ip: process.env.DUNDB_APP_ENV_S3_DB1_BKED_IP1,
      headers: {
        Authorization: process.env.DUNDB_APP_ENV_S3_DB1_PASS,
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

  sessions: function() {
    var sessions = {
      session: {
        options:{
          secret: process.env.DUNDB_APP_ENV_S2_WB1_SESS_SEC,
          name: process.env.DUNDB_APP_ENV_S2_WB1_SESS_NAME,
          resave: false,
          saveUninitialized: false, 
          cookie: { secure: true },
          // genid:
        },
      },
      store: {
        options: {
          host: process.env.DUNDB_APP_ENV_S4_DB1_BKED_IP1,
          port: process.env.DUNDB_APP_ENV_S4_DB1_BKED_PORT,
          db: parseInt(process.env.DUNDB_APP_ENV_S4_DB1_INST1),
          pass: process.env.DUNDB_APP_ENV_S4_DB1_PASS,
          // prefix: 'fliXnet:sessions:',
        },
      },
    };

    return sessions;
  },

  users: function() {
    var users = {
      secret: Buffer.from(process.env.DUNDB_APP_ENV_S2_WB1_USER_SEC),
      store: {
        host: process.env.DUNDB_APP_ENV_S4_DB1_BKED_IP1,
        port: process.env.DUNDB_APP_ENV_S4_DB1_BKED_PORT,
        options: {
          db: parseInt(process.env.DUNDB_APP_ENV_S4_DB1_INST2),
          auth_pass: process.env.DUNDB_APP_ENV_S4_DB1_PASS, 
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
              encryptionKey: process.env.DUNDB_APP_ENV_S2_WB1_OAUT_SEC,
              host: process.env.DUNDB_APP_ENV_S4_DB1_BKED_IP1,
              port: process.env.DUNDB_APP_ENV_S4_DB1_BKED_PORT,
              db: parseInt(process.env.DUNDB_APP_ENV_S4_DB1_INST3),
              options:{
                auth_pass: 'helloworld',
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
      secret: Buffer.from(process.env.DUNDB_APP_ENV_S2_WB1_KRYP_SEC),
      options: {
        hashBytes: parseInt(process.env.DUNDB_APP_ENV_S2_WB1_KRYP_HBS),
        saltBytes: parseInt(process.env.DUNDB_APP_ENV_S2_WB1_KRYP_SBS),
        iterations: parseInt(process.env.DUNDB_APP_ENV_S2_WB1_KRYP_ITS),
      },
    };

    return krypto;  
  },
};

(function readPKIFiles() {
  process.env.FLIXNET_WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  process.env.FLIXNET_WEB_HTTPS_CRT = fs.readFileSync(appConfig.web().https.crt, 'utf8');
  process.env.FLIXNET_DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;
