'use strict';

var request = require('request');

var requests = {
  db: function (dbConfig, errorHandlers) {
    return { 
      api: {
        cypherRequest: function(query, params, resultType, includeStats, callback, resNodejs) {
          console.log(query);

          request.post({
            headers: dbConfig.headers,
            url: dbConfig.https.url,
            ca: process.env.DB_HTTPS_CA,
            json: { statements: [{ statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats }] }, 
          }, function(err, res) {
              var nodesDeleted = 0
             console.log(JSON.stringify(err));
             console.log(JSON.stringify(res.body));
             if(res.body.results[0] && res.body.results[0].stats) {
              nodesDeleted = res.body.results[0].stats.nodes_deleted;
             }

             if (err) {
              errorHandlers.api.nodejsError(err, resNodejs);
             } else if (res.body.errors.length > 0){
              errorHandlers.api.neo4jBadRequest(err, resNodejs, res.body);
             } else if (res.body.results[0].data.length > 0 || nodesDeleted > 0){
              callback(err, res.body);
             } else {
              errorHandlers.api.neo4jNotFound(err, resNodejs, res.body);
             }      
            }
          );
        },
      },
      web: {
        cypherRequest: function(query, params, resultType, includeStats, callback, locales, resNodejs) {
          console.log(query);

          request.post({
            headers: dbConfig.headers,
            url: dbConfig.https.url,
            ca: process.env.DB_HTTPS_CA,
            json: { statements: [{ statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats }] }, 
          }, function(err, res) {
              var nodesDeleted = 0
             console.log(JSON.stringify(err));
             if(res.body.results[0] && res.body.results[0].stats) {
              nodesDeleted = res.body.results[0].stats.nodes_deleted;
             }
             if (err) {
              errorHandlers.web.nodejsError(err, locales, resNodejs);
             } else if (res.body.errors.length > 0){
              errorHandlers.web.neo4jBadRequest(err, locales, resNodejs, res.body);
             } else if (res.body.results[0].data.length > 0 || nodesDeleted > 0){
              
              callback(err, res.body);
             } else {
              errorHandlers.web.neo4jNotFound(err, locales, resNodejs, res.body);
             }      
            }
          );
        },

        cypherBatch: function(query0, params0, query1, params1, callback, locales, resNodejs) {
          request.post({
            headers: dbConfig.headers,
            url: dbConfig.batch.url,
            ca: process.env.DB_HTTPS_CA,
            json: [ {
              method: dbConfig.batch.job.method,
              to: dbConfig.batch.job.url,
              body: {
                query: query0,
                params: params0,
              },
              id: 0,
            }, {
              method: dbConfig.batch.job.method,
              to: dbConfig.batch.job.url,
              body: {
                query: query1,
                params: params1,
              },
              id: 1,
            }, ], 
          }, function(err, res) {
              // console.log(err);
              console.log(JSON.stringify(res));

              if (err) {
                errorHandlers.web.nodejsError(err, locales, resNodejs);
              } else {
                callback(err, res.body);
              }     
            }
          );
        },
      }
    };
  },
};

module.exports = requests;
