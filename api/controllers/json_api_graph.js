'use strict';

// JSON only API:
var jsonApiGraph = function (api) {
  var that = this;  

  var basePath = '/' + api.tags[0].name + '/' + that.type;
  var basePathRelationships = '/' + api.tags[0].name + '/' + that.type + '/' + that.relationships.typePlural;
  var basePathSearch = '/' + api.tags[0].name + '/' + that.type + '/' + that.search.type;
  var idPathTemplate = '/{id}';

  var includeStats = false;
  var resultType = ['row'];

  return {
    readAllGraph: function(req, res) {
      var query = that.queries.readAllGraph;
      var params = {};
      var callback = that.callbacks.graph(res, api.paths[basePath].get.operationId, that.type).api;

      resultType = ['graph'];

      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },

    readGraphOfMovie: function(req, res) {
      var query = that.queries.readGraphOfMovie;
      var params = {id: req.swagger.params.id.value};
      var callback = that.callbacks.graph(res, api.paths[basePath + '/readGraphOfMovie' + idPathTemplate].get.operationId, that.type).api;

      resultType = ['graph'];

      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },

    readGraphOfPerson: function(req, res) {
      var query = that.queries.readGraphOfPerson;
      var params = {id: req.swagger.params.id.value};
      var callback = that.callbacks.graph(res, api.paths[basePath + '/readGraphOfPerson' + idPathTemplate].get.operationId, that.type).api;

      resultType = ['graph'];

      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },
    relationships:{
      readAllPaginated: function(req, res) {
        var query = that.queries.relationships.readAllPaginated;
        var params = {offset: req.swagger.params.pagination.value, amount: 6};
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/readAllPaginated'].get.operationId, that.type, '', '', '', that.relationships.typePlural).relationships.api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },
    },
    search: {
      labelsAmountNodes: function(req, res) {
        var query = that.queries.search.labelsAmountNodes;
        var params = {};
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/labelsAmountNodes'].get.operationId, that.type, '', '','', that.search.type).api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },

      typeAmountRelationships: function(req, res) {
        var query = that.queries.search.typeAmountRelationships;
        var params = {};
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/typeAmountRelationships'].get.operationId, that.type, '', '','', that.search.type).api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },

      topPersons: function(req, res) {
        var relationshipName = req.swagger.params.relationshipName.value;

        var query = that.queries.search.topPersons[relationshipName];
        var params = {};
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/topPersons'].get.operationId, that.type, '', '','', that.search.type).api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },

      movieCast: function(req, res) {
        var query = that.queries.search.movieCast;
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/movieCast' + idPathTemplate].get.operationId, that.type, '', '','', that.search.type).api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },

      topColleagues: function(req, res) {
        var relationshipName = req.swagger.params.relationshipName.value;

        var query = that.queries.search.topColleagues[relationshipName];
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/topColleagues' + idPathTemplate].get.operationId, that.type, '', '','', that.search.type).api;

        resultType = ['row'];

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },
    },
  };
};

module.exports = jsonApiGraph;
