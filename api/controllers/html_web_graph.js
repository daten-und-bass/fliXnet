'use strict';

// HTML Web:
var htmlWebGraph = function (api, localesUtils) {
  var that = this;

  var basePath = '/{locale}/' + that.type
  var basePathRelationships = '/{locale}/' + that.type + '/' + that.relationships.typePlural;
  var basePathSearch = '/{locale}/' + that.type + '/' + that.search.type;
  var idPathTemplate = '/{id}';

  var includeStats = false;
  var resultType = ['row'];

  var locale = localesUtils.getDefaultLocale(); 
  var locales = localesUtils.setLocales('noLocale', locale, that.strings);

  return {
    relationships: {
      getCreate: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query0 = that.personQueries.search.readAllNames;
        var params0 = {};
        var query1 = that.movieQueries.search.readAllTitles;
        var params1 = {};

        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/create'].get.operationId, that.type, locales, that.templateFolder + '/create', '', that.relationships.typePlural, that.relationshipTypes).relationships.web;

        var resultType = ['row'];

        that.requests.web.cypherBatch(query0, params0, query1, params1, callback, locales, res);
      },

      create: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;
        
        var query;
        switch(req.swagger.params.type.value){
          case 'ACTED_IN': 
            query = that.queries.relationships.create_ACTED_IN; break;
          case 'DIRECTED':
            query = that.queries.relationships.create_DIRECTED; break;
          case 'FOLLOWS':
            query = that.queries.relationships.create_FOLLOWS; break;
          case 'PRODUCED':
            query = that.queries.relationships.create_PRODUCED; break;
          case 'REVIEWED':
            query = that.queries.relationships.create_REVIEWED; break;
          case 'WROTE':
            query = that.queries.relationships.create_WROTE; break;
          default:
            query = 'Empty Query';
        }

        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/create'].post.operationId, that.type, locales, that.templateFolder + '/read', '', that.relationships.typePlural).relationships.web;

        resultType = ['row', 'graph'];

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
      },

      read: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query = that.queries.relationships.read;
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/read' + idPathTemplate].get.operationId, that.type, locales, that.templateFolder + '/read', req.swagger.params.id.value, that.relationships.typePlural, that.relationshipTypes).relationships.web;

        var resultType = ['row'];

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
      },

      getUpdate: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query = that.queries.relationships.getUpdate;
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/update' + idPathTemplate].get.operationId, that.type, locales, that.templateFolder + '/update', req.swagger.params.id.value, that.relationships.typePlural, that.relationshipTypes).relationships.web;

        var resultType = ['row'];

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
      },

      update: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query;
        switch(req.swagger.params.type.value){
          case 'ACTED_IN': 
            query = that.queries.relationships.update_ACTED_IN; break;
          case 'REVIEWED':
            query = that.queries.relationships.update_REVIEWED; break;
          case 'DIRECTED':
          case 'FOLLOWS':
          case 'PRODUCED':
          case 'WROTE':
            query = 'Not allowed'; break;
          default:
            query = 'Empty Query';
        }

        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/update' + idPathTemplate].post.operationId, that.type, locales, that.templateFolder + '/read', req.swagger.params.id.value, that.relationships.typePlural, that.relationshipTypes).relationships.web; 

        var resultType = ['row'];

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
      },

      delete: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query = that.queries.relationships.delete;
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathRelationships + '/delete' + idPathTemplate].post.operationId, that.type, locales, '', '', that.relationships.typePlural).relationships.web;

        var resultType = ['row'];
        includeStats = true;

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res);
      },
    },
    search: {
      searchField: function(req, res) {
        locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
        locale = req.swagger.params.locale.value;

        var query = that.queries.search.searchField;
        var params = that.params.otherParams.set(req.swagger.params);
        var callback = that.callbacks.graph(res, api.paths[basePathSearch + '/searchField'].get.operationId, that.type, locales, that.templateFolder + '/search', '', that.search.type, '', req.swagger.params.searchParam.value).search.web;

        resultType = ['graph'];

        var isSearchField = true;

        that.requests.web.cypherRequest(query, params, resultType, includeStats, callback, locales, res, isSearchField);
      },
    },
  }; 
};

module.exports = htmlWebGraph;
