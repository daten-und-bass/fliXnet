'use strict';

// HTML Web Only:
var htmlWebNodes = function (api, localesUtils) {
  var that = this;

  var basePath = '/{locale}/' + that.nodeTypePlural;
  var idPathTemplate = '/{id}';

  var includeStats = false;
  var resultType = ['row'];

  return {
    getCreate: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      res.render(that.templateFolder + '/create', locales);  
    },

    create: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      var query = that.queries.create;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + '/create'].post.operationId, that.nodeType, locales).web;

      resultType = ['row'];

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    }, 

    readBulk: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      var query;
      var params;
      var callback;

      if(req.swagger.params[that.inQueryParams].value) {
        if (req.swagger.params[that.inQueryParams].value === -1) {
          query = that.queries.readBulkWhereNotExistsParam;
        } else {
          query = that.queries.readBulkParam;
        }

        params = that.params.otherParams.set(req.swagger.params);
        callback = that.callbacks.nodes(res, api.paths[basePath].get.operationId, that.nodeTypePlural, locales, that.templateFolder + '/readBulk', '', req.swagger.params[that.inQueryParams].value).web;
      } else {
        query = that.queries.readBulkNoParam;
        params = {};
        callback = that.callbacks.nodes(res, api.paths[basePath].get.operationId, that.nodeTypePlural, locales, that.templateFolder + '/readBulk').web;
      }

      resultType = ['graph'];

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    }, 

    read: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      resultType = ['row'];

      var query = that.queries.read;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + '/read' + idPathTemplate].get.operationId, that.nodeType, locales, that.templateFolder + '/read', req.swagger.params.id.value).web;

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    },

    getUpdate: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      var query = that.queries.getUpate;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + '/update' + idPathTemplate].get.operationId, that.nodeType, locales, that.templateFolder + '/update', that.params.otherParams.get().id).web;
      
      resultType = ['row'];

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    },

    update: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      var query = that.queries.update;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + '/update' + idPathTemplate].post.operationId, that.nodeType, locales, that.templateFolder + '/read', req.swagger.params.id.value).web;
            
      resultType = ['row'];

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    },

    delete: function(req, res) {
      var locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      var locale = req.swagger.params.locale.value;

      var query = that.queries.delete;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, api.paths[basePath + '/delete' + idPathTemplate].post.operationId, that.nodeType, locales).web;
      
      resultType = ['row'];
      includeStats = true;

      that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
    }
  };
};

module.exports = htmlWebNodes;
