'use strict';

var htmlWebIndex = function (api, localesUtils) {
  var that = this;

  var locale = localesUtils.getDefaultLocale(); 
  var locales = localesUtils.setLocales('noLocale', locale, that.strings);

  var includeStats = false;
  var resultType = ['row'];

  return {
    index: function(req, res) {
      var guessedLocale = req.acceptsLanguages(that.supportedLocales);

      if (guessedLocale) {
        locales = localesUtils.setLocales(locale, guessedLocale, that.strings);
        locale = guessedLocale;
        res.redirect('/' + guessedLocale);
      } else {
        locales = localesUtils.setLocales(locale, that.defaultLocale, that.strings);
        locale = that.defaultLocale;
        res.redirect(that.defaultLocale);
      }
    },

    index_locale: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.movieQueries.search.readLatestFourNodes;
      var params = {};
      var callback = that.callbacks.graph(res, api.paths['/{locale}'].get.operationId, that.type, locales, 'index', '', 'movies').web;

      resultType = ['graph'];

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    },

    about: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/about', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },

    contact: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/contact', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },
    
    imprint: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/imprint', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },

    getRegister: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      if(req.isAuthenticated()) { 
        return res.redirect('back');
      } else {
        res.render('service_pages/user/register', 
          { locale: locale,
            localesMenu: locales.localesMenu,
            localesCommands: locales.localesCommands,
            localesUser: locales.localesUser,
            message: req.swagger.params.authMsg.value,
        });
      }
    },

    register: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      console.log('login called');
    },

    getLogin: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      if(req.isAuthenticated()) { 
        return res.redirect('back');
      } else {
        res.render('service_pages/user/login', 
          { locale: locale,
            localesMenu: locales.localesMenu,
            localesCommands: locales.localesCommands,
            localesUser: locales.localesUser,
            message: req.swagger.params.authMsg.value,
            redUrl: req.swagger.params.redUrl.value, 
        });
      } 
    },

    login: function(req, res, next) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      console.log('login called');
    },

    user: function(req, res, next) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var responseObjectToSwagger = {
        locale: locales.locale,
        localesMenu: locales.localesMenu,
        localesCommands: locales.localesCommands,
        localesUser: locales.localesUser,
      };

      that.userDB.get(req.user.id.id, function (err, userObject) {
        
        if (err) { return next(err); }

        if (userObject) {
          responseObjectToSwagger.user = userObject;
          res.render('service_pages/user/user', responseObjectToSwagger);
        } else {
          var error = new Error('Not Found');
          error.status = 404;
          error.code = 'Not Found';
          error.message = 'No database ressource found for this request.';
          responseObjectToSwagger.error = error;
          res.render('error', responseObjectToSwagger);
        }
      });
    },

    getUpdate: function(req, res, next) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var responseObjectToSwagger = {
        locale: locales.locale,
        localesMenu: locales.localesMenu,
        localesCommands: locales.localesCommands,
        localesUser: locales.localesUser,
      };

      that.userDB.get(req.user.id.id, function (err, userObject) {

        if (err) { return next(err); }

        if (userObject) {
          responseObjectToSwagger.user = userObject;
          res.render('service_pages/user/update', responseObjectToSwagger); 
        } else {
          var error = new Error('Not Found');
          error.status = 404;
          error.code = 'Not Found';
          error.message = 'No database ressource found for this request.';
          responseObjectToSwagger.error = error;
          res.render('error', responseObjectToSwagger);
        }
      });
    },

    update: function(req, res, next) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var responseObjectToSwagger = {
        locale: locales.locale,
        localesMenu: locales.localesMenu,
        localesCommands: locales.localesCommands,
        localesUser: locales.localesUser,
      };

      var userObject = {};

      if(req.swagger.params.fullname.value) { userObject.fullname = req.swagger.params.fullname.value; }
      if(req.swagger.params.birth.value) { userObject.birth = req.swagger.params.birth.value; }
      if(req.swagger.params.email.value) { userObject.email = req.swagger.params.email.value; }
      if(req.swagger.params.password.value) { userObject.password = req.swagger.params.password.value; }
      if(req.swagger.params.passwordNew.value) { userObject.passwordNew = req.swagger.params.passwordNew.value; }

      that.userDB.update(req.user.id.id, userObject, function (err, success) {
        
        if (err) { return next(err); }

        if (success) {
          res.redirect('/' + locale + '/user');
        } else {
          res.redirect('/' + locale + '/user/update');
        }
      });
    },

    logout: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;
      
      req.logout();
      
      req.session.destroy(function(){
        res.redirect('/' + locale);
      });
    },

    delete: function(req, res, next) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      that.userDB.delete(req.user.id.id, function (err, success) {

        if (err) { return next(err); }

        if (success) {
          res.json({success: true});
        } else {
          res.json({success: false});
        }
      });
    },
  };
};

module.exports = htmlWebIndex;
