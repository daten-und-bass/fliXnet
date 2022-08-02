'use strict';

var express = require('express');
var path = require('path');
var https = require('https');

var helmet = require('helmet');
var forceSSL = require('express-force-ssl');

var webConfig = require('./config/context').webConfig;
var sessionsConfig = require('./config/context').sessionsConfig;

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

var userDB = require('./config/context').userDB;
var passport = require('passport');
require('./config/authentication/passport')(passport, userDB); 

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

var httpsServer = https.createServer({key: process.env.FLIXNET_WEB_HTTPS_KEY, cert: process.env.FLIXNET_WEB_HTTPS_PUB}, app);
httpsServer.listen(webConfig.https.port); 

app.set('trust proxy', webConfig.proxies);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set("forceSSLOptions", { httpsPort: webConfig.https.port });

app.use(helmet());
app.use(forceSSL);

app.use(express.static(path.join(__dirname, 'public')));

var sessionOptions = sessionsConfig.session.options;
sessionOptions.store = new RedisStore(sessionsConfig.store.options);
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use(function reqToResLocals(req, res, next){
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

app.use(function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

app.use(function clientErrorHandler(err, req, res, next) {
  if (req.xhr) { res.status(500).send({ error: 'Something failed!' }); } 
  else { next(err); }
});

app.use(function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
});

// check if reqauthenticated()and others return correctly for each case???
var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    'local-register': function(req, def, scopes, callback) {
      passport.authenticate('local-register', function(err, newUser, info) {
          var locale = req.swagger.params.locale.value;
          
          if(err) { return callback(err); }

          if(newUser) {
            req.logIn(newUser, function(err) {

              if (err) { return callback(err); }

              return req.res.redirect('/' + locale);
            });
          } else  {
            return req.res.redirect('/' + locale + '/user/register/?authMsg=' + parseInt(info.message)); 
          }
      })(req, null, callback); 
    },
    'local-login': function(req, def, scopes, callback) {
      passport.authenticate('local-login', function(err, user, info) {
        var locale = req.swagger.params.locale.value;

        if(err) { return callback(err); }
        
        if(user) {
          req.logIn(user, function(err) {

            if (err) { return callback(err); }

            return req.swagger.params.redUrl.value === undefined ? req.res.redirect('/' + locale) : req.res.redirect(req.swagger.params.redUrl.value);
            
          });
        } else {
          return req.res.redirect('/' + locale + '/user/login/?authMsg=' + parseInt(info.message));
        }
      })(req, null, callback); 
    },
    'local-auth': function(req, def, scopes, callback) {
      var locale = req.swagger.params.locale.value;

      if (req.isAuthenticated()){

        return callback();
      } else {
        return req.res.redirect('/' + locale + '/user/login/?authMsg=1&redUrl=' + req.url);
      }
    },
  },
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // app.use(swaggerExpress.runner.swaggerTools.swaggerSecurity(config.swaggerSecurityHandlers));
 
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/']) {
    console.log('Project started.');
  }
});

module.exports = app; 


