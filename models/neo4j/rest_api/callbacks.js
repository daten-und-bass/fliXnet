'use strict';

var validator = require('validator');

var callbacks = {
  main: function (api) {
    
    return   {
      nodes: function (res, operationId, nodeType, locales, template, nodeId, inQueryParam) {

        return {
          api: function (error, responseBodyFromNeo) {
            var basePath = '/' + api.tags[0].name + '/' + nodeType + (nodeType.endsWith('s') ? '' : 's');
            var idPathTemplate = '/{id}';

            var responseObjectToSwagger = {};
            var nodes = [];

            switch (operationId){
              case api.paths[basePath].get.operationId:
                nodes = [];
                nodes = callbacks.utils.readBulk(error, responseBodyFromNeo);
                responseObjectToSwagger[nodeType] = nodes;
                break;
              case api.paths[basePath + idPathTemplate].delete.operationId:
                responseObjectToSwagger.nodes_deleted = responseBodyFromNeo.results[0].stats.nodes_deleted;
                break;
              default:
                responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
            }

            return res.json(responseObjectToSwagger);
          },

          web: function (error, responseBodyFromNeo) {
            var basePath = '/{locale}/' + nodeType + (nodeType.endsWith('s') ? '' : 's');
            var idPathTemplate = '/{id}';

            var responseObjectToSwagger = {
              locale: locales.locale,
              localesMenu: locales.localesMenu,
              localesCommands: locales.localesCommands,
              localesStrings: locales.localesStrings,
              id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
            };
            var nodes = [];

            switch (operationId){
              case api.paths[basePath + '/create'].post.operationId:
                responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['New <Instance> created'];
                responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
                var url = '/' + locales.locale + '/' +nodeType + 's/read/' + responseBodyFromNeo.results[0].data[0].row[1];

                return res.redirect(url);
              case api.paths[basePath].get.operationId:
                nodes = [];
                nodes = callbacks.utils.readBulkGraph(error, responseBodyFromNeo);
                responseObjectToSwagger[nodeType] = nodes;
                responseObjectToSwagger.inQueryParam = inQueryParam;
                break;
              case api.paths[basePath + '/read' + idPathTemplate].get.operationId:
                responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['<Instance>'];
                responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
                break;
              case api.paths[basePath + '/update' + idPathTemplate].post.operationId:
                responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['<Instance> updated'];
                responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
                break;
              case api.paths[basePath + '/delete' + idPathTemplate].post.operationId:
                responseObjectToSwagger.nodes_deleted = responseBodyFromNeo.results[0].stats.nodes_deleted;
                
                return res.json(responseObjectToSwagger);
              default:
                responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
            }

            return res.render(template, responseObjectToSwagger);
          },

          search: {
            api: function (error, responseBodyFromNeo) {
              var basePath = '/' + api.tags[0].name + '/' + nodeType + (nodeType.endsWith('s') ? '' : 's') + '/search';

              var responseObjectToSwagger = {};
              var nodes = [];

              switch (operationId){
                case api.paths[basePath + '/distinctProperties'].get.operationId:
                  // responseObjectToSwagger.distinctValues = responseBodyFromNeo.results[0].data[0].row[0];
                  responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                  responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
                  break;
                default:
                  responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                  responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
              }
              return res.json(responseObjectToSwagger);
            },
          },
        };
      },

      graph: function (res, operationId, type, locales, template, nodeId, subType, relationshipTypes) {
        
        return {
          api: function (error, responseBodyFromNeo) {
            var basePath = '/' + api.tags[0].name + '/' + type;
            var idPathTemplate = '/{id}';

            var responseObjectToSwagger = {};

            switch (operationId) {
              case api.paths[basePath].get.operationId:
              case api.paths[basePath + '/readGraphOfMovie' + idPathTemplate].get.operationId:
              case api.paths[basePath + '/readGraphOfPerson' + idPathTemplate].get.operationId:
                responseObjectToSwagger.graph = callbacks.utils.nodeLinks(error, responseBodyFromNeo);
                break;
              default:
                // responseObjectToSwagger.graph = callbacks.utils.nodeLinks(error, responseBodyFromNeo);
                responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
            }

            return res.json(responseObjectToSwagger);
          },

          web: function (error, responseBodyFromNeo) {
            var basePath = '/{locale}'

            var responseObjectToSwagger = {
              locale: locales.locale,
              localesMenu: locales.localesMenu,
              localesCommands: locales.localesCommands,
              localesStrings: locales.localesStrings,
              id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
            };
            var nodes = [];

            switch (operationId){
              case api.paths[basePath].get.operationId:
                nodes = [];
                nodes = callbacks.utils.readBulkGraph(error, responseBodyFromNeo);
                responseObjectToSwagger[subType] = nodes;
                break;
              default:
                nodes = callbacks.utils.readBulkGraph(error, responseBodyFromNeo);
                responseObjectToSwagger[subType] = nodes;
            }

            return res.render(template, responseObjectToSwagger);
          },

          relationships: {
            api: function (error, responseBodyFromNeo) {
              var basePath = '/' + api.tags[0].name + '/' + type + '/' + subType;

              var responseObjectToSwagger = {};

              switch (operationId) {
                case api.paths[basePath +'/readAllPaginated'].get.operationId:
                  responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                  responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
                default:
                  responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                  responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
              }

              return res.json(responseObjectToSwagger);
            },

            web: function (error, responseBodyFromNeo) {
              var basePath = '/{locale}/' + type + '/' + subType;
              var idPathTemplate = '/{id}';

              var responseObjectToSwagger = {
                locale: locales.locale,
                localesMenu: locales.localesMenu,
                localesCommands: locales.localesCommands,
                localesStrings: locales.localesStrings,
                id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
              };

              switch (operationId) {
                case api.paths[basePath + '/create'].get.operationId:
                  responseObjectToSwagger.persons = callbacks.utils.escapeStringProperties(responseBodyFromNeo[0].body.data);
                  // responseObjectToSwagger.persons = responseBodyFromNeo[0].body.data;
                  responseObjectToSwagger.relationships = relationshipTypes;
                  responseObjectToSwagger.movies = callbacks.utils.escapeStringProperties(responseBodyFromNeo[1].body.data);
                  break;
                case api.paths[basePath + '/create'].post.operationId:
                  responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['New Relationship created'];
                  responseObjectToSwagger.relationship = responseBodyFromNeo.results[0].data[0];
                  var url = '/' + locales.locale + '/graph/' + subType + '/read/' + responseBodyFromNeo.results[0].data[0].row[2];

                  return res.redirect(url);
                case api.paths[basePath + '/read' + idPathTemplate].get.operationId:
                  responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['Relationship'];
                  responseObjectToSwagger.relationship = callbacks.utils.escapeAllProperties(responseBodyFromNeo.results[0].data[0].row);
                  break;
                case api.paths[basePath + '/update' + idPathTemplate].get.operationId:
                  responseObjectToSwagger.relationship = responseBodyFromNeo.results[0].data[0];
                  break;
                case api.paths[basePath + '/update' + idPathTemplate].post.operationId:
                  responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['Relationship updated'];
                  responseObjectToSwagger.relationship = responseBodyFromNeo.results[0].data[0];
                  break;
                case api.paths[basePath + '/delete' + idPathTemplate].post.operationId:
                  responseObjectToSwagger.relationship_deleted = responseBodyFromNeo.results[0].stats.relationship_deleted;
                  
                  return res.json(responseObjectToSwagger);
                default:
                  responseObjectToSwagger.relationship = responseBodyFromNeo.results[0].data[0];
              }

              return res.render(template, responseObjectToSwagger);
            },
          },

          search: {
            api: function (error, responseBodyFromNeo) {
              var basePath = '/' + api.tags[0].name + '/' + type;
              var idPathTemplate = '/{id}';

              var responseObjectToSwagger = {};

              switch (operationId) {
                // case '...':
                //   break;
                default:
                  responseObjectToSwagger.columns = responseBodyFromNeo.results[0].columns;
                  responseObjectToSwagger.data = responseBodyFromNeo.results[0].data;
              }

              return res.json(responseObjectToSwagger);
            },
            
            web: function (error, responseBodyFromNeo) {
              var basePath = '/{locale}/' + type + '/' + subType;

              var responseObjectToSwagger = {
                locale: locales.locale,
                localesMenu: locales.localesMenu,
                localesCommands: locales.localesCommands,
                localesStrings: locales.localesStrings,
                id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
              };

              switch (operationId) {
                case api.paths[basePath + '/searchField'].get.operationId:
                  responseObjectToSwagger.graph = responseBodyFromNeo.results[0].data;
                  break;
                default:
                  responseObjectToSwagger.graph = responseBodyFromNeo.results[0].data;
              }

              return res.render(template, responseObjectToSwagger);
            },
          },
        };
      },
    };
  },
  utils: {
    readBulk: function(error, responseBodyFromNeo) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];

      dataFromNeo4j = responseBodyFromNeo.results[0].data;
      dataFromNeo4j.map(function(element, index) {
        dataToSwagger[index] = element.row[0];
      });

      return dataToSwagger;
    },

    readBulkGraph: function(error, responseBodyFromNeo) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];

      dataFromNeo4j = responseBodyFromNeo.results[0].data;
      dataFromNeo4j.map(function(element, index) {
        dataToSwagger[index] = element.graph.nodes[0];
      });

      return dataToSwagger;
    },

    idIndex: function(array, id) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return i;
        }
      }

      return null;
    },

    nodeLinks: function(error, response) {
      var nodes = [];
      var links = [];

      response.results[0].data.forEach(function(row) {

        row.graph.nodes.forEach(function(n) {
          if (callbacks.utils.idIndex(nodes, n.id) === null) {
            if (n.labels[0] === 'Movie') {
              nodes.push({
                id: n.id,
                label: n.labels[0],
                title: n.properties.title,
                tagline: n.properties.tagline,
                released: n.properties.released,
              });
            }

            if (n.labels[0] === 'Person') {
              nodes.push({
                id: n.id,
                label: n.labels[0],
                name: n.properties.name,
                born: n.properties.born,
              });
            }
          }
        });

        links = links.concat(row.graph.relationships.map(function(r) {

          return {
            source: callbacks.utils.idIndex(nodes, r.startNode),
            target: callbacks.utils.idIndex(nodes, r.endNode),
            value: r.type,
          };
        }));
      });

      return { nodes:nodes, links:links };
    },
    escapeStringProperties: function (dirty) {
      var clean = [];

      dirty.map(function(element, index) {
        clean[index] = [validator.escape(element[0]), element[1]];          
      });

      return clean;
    },
    escapeAllProperties: function (dirty) {
      var clean = [];
      
      dirty.forEach(function(element, index) {
        if(typeof(element) === 'string') {
          clean[index] = validator.escape(element); 
        } else if (Array.isArray(element)) {
          var innerClean = [];
          element.forEach(function (innerElement, innerIndex) {
            innerClean[innerIndex] = validator.escape(innerElement);
          });
          clean[index] = innerClean;
          // console.log(innerClean);
        } else {
          clean[index] = element; 
        }
      });
      
      return clean;
    },
  },
};

module.exports = callbacks.main;
