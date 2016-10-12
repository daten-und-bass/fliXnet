'use strict';

var express = require('express');
// var router = express.Router();
var path = require('path');
var https = require('https');

var helmet = require('helmet');
var forceSSL = require('express-force-ssl');
var app_config = require('./config/app');
// var options = {key: process.env.WEB_HTTPS_KEY, cert: process.env.WEB_HTTPS_CRT};

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
// module.exports = app; // for testing

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('trust proxy', 'loopback, 192.168.0.31');

// Force to use ONLY HTTPS
app.use(helmet());
app.set("forceSSLOptions", { httpsPort: app_config.web().https.port });
app.use(forceSSL);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/en', express.static(path.join(__dirname, 'public')));
app.use('/es', express.static(path.join(__dirname, 'public')));
app.use('/de', express.static(path.join(__dirname, 'public')));
app.use('/fr', express.static(path.join(__dirname, 'public')));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  app.use(function (req, res, next) {
	console.log('Time: %d', Date.now());
	next();
  });

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});

// Create HTTPS Server with options from above and port from (non-swagger) config file app_config
var httpsServer = https.createServer({key: process.env.WEB_HTTPS_KEY, cert: process.env.WEB_HTTPS_CRT}, app);
// var httpsServer = https.createServer({key: process.env.FLIXNET_WEB_HTTPS_KEY, cert: process.env.FLIXNET_WEB_HTTPS_CRT}, app);
httpsServer.listen(app_config.web().https.port);

module.exports = app; 
