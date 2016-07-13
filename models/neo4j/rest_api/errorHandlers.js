'use strict';

var errorHandlers = {
  api: {
    nodejsError: function (error, resNodejs, resBodyNeo4j) {
      resNodejs.status(error.status || 500);

      return resNodejs.json(errorHandlers.api.utils.responseCreator(error));
    },
    neo4jBadRequest: function (error, resNodejs, resBodyNeo4j) {
      var error = new Error('Bad Request');
      error.status = 400;
      error.code = resBodyNeo4j.errors[0].code;
      error.message = resBodyNeo4j.errors[0].message;

      resNodejs.status(error.status || 400); 

      return resNodejs.json(errorHandlers.api.utils.responseCreator(error));
    },
    neo4jNotFound: function (error, resNodejs, resBodyNeo4j) {
      var error = new Error('Not Found');
      error.status = 404;
      error.code = 'Not Found';
      error.message = 'No database ressource found for this URL';

      resNodejs.status(error.status || 404);

      return resNodejs.json(errorHandlers.api.utils.responseCreator(error)); 
    },
    utils: {
      responseCreator: function (error) {
        var responseObjectToSwagger = {};

        console.log(process.env.NODE_ENV)
        
        responseObjectToSwagger.message = error.message;
        if (process.env.NODE_ENV === 'development') {
          responseObjectToSwagger.error = error;
        } else {
          responseObjectToSwagger.error = {};
        }

        return responseObjectToSwagger;
      },
    }
  },
  web: {
    nodejsError: function (error, locales, resNodejs, resBodyNeo4j) {
      resNodejs.status(error.status || 500);

      return resNodejs.render('error', errorHandlers.web.utils.responseCreator(error, locales));
    },
    neo4jBadRequest: function (error, locales, resNodejs, resBodyNeo4j) {
      var error = new Error('Bad Request');
      error.status = 400;
      error.code = resBodyNeo4j.errors[0].code;
      error.message = resBodyNeo4j.errors[0].message;

      resNodejs.status(error.status || 400);

      return resNodejs.render('error', errorHandlers.web.utils.responseCreator(error, locales));
    },
    neo4jNotFound: function (error, locales, resNodejs, resBodyNeo4j) {
      var error = new Error('Not Found');
      error.status = 404;
      error.code = 'Not Found';
      error.message = 'No database ressource found for this URL';

      resNodejs.status(error.status || 404);

      return resNodejs.render('error', errorHandlers.web.utils.responseCreator(error, locales));  
    },
    utils: {

      responseCreator: function (error, locales) {
        var responseObjectToSwagger = {
          locale: locales.locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
          localesStrings: locales.localesStrings,
        };

        console.log(process.env.NODE_ENV)
        
        responseObjectToSwagger.message = error.message;
        if (process.env.NODE_ENV === 'development') {
          responseObjectToSwagger.error = error;
        } else {
          responseObjectToSwagger.error = {};
        }

        return responseObjectToSwagger;
      },
    },
  },
};

module.exports = errorHandlers;
