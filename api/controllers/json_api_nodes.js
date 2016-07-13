'use strict';

// JSON only API:
var jsonApiNodes = function (api) {
  var that = this;

  var basePath = '/' + api.tags[0].name + '/' + that.nodeTypePlural;
  var basePathSearch = '/' + api.tags[0].name + '/' + that.nodeTypePlural + '/' + that.search.type;
  var idPathTemplate = '/{id}';

  var includeStats = false;
  var resultType = ['row'];

  return {
    create: function(req, res) {
      var query = that.queries.create;
      var params = that.params.inBodyParams.set(req.swagger.params, that.nodeType);
      var callback = that.callbacks.nodes(res, api.paths[basePath].post.operationId, that.nodeType).api;
      
      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },

    readBulk: function(req, res) {
      var query = (req.swagger.params[that.inQueryParams].value) ? that.queries.readBulkParam : that.queries.readBulkNoParam;;
      var params = (req.swagger.params[that.inQueryParams].value) ? that.params.otherParams.set(req.swagger.params) : {} ;
      var callback = that.callbacks.nodes(res, api.paths[basePath].get.operationId, that.nodeTypePlural).api;
      
      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    }, 

    read: function(req, res) {
      var query = that.queries.read;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + idPathTemplate].get.operationId, that.nodeType).api;
      
      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },

    update: function(req, res) {
      var query = that.queries.update;
      var params = that.params.inBodyParams.set(req.swagger.params, that.nodeType);
      var callback = that.callbacks.nodes(res, api.paths[basePath + idPathTemplate].put.operationId, that.nodeType).api;
      
      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },

    delete: function(req, res) {
      var query = that.queries.delete;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + idPathTemplate].delete.operationId, that.nodeType).api;

      includeStats = true;

      that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
    },
    search: {
      distinctProperties: function(req, res) {
        var propertyName = req.swagger.params.propertyName.value;

        var query = that.queries.search.distinctProperties[propertyName];
        var params = {};
        var callback = that.callbacks.nodes(res, api.paths[basePathSearch + '/distinctProperties'].get.operationId, that.nodeType).search.api;

        that.requests.api.cypherRequest(query, params, resultType, includeStats, callback, res);
      },
    },
  };
};

module.exports = jsonApiNodes;
