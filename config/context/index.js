'use strict';

var api = require('yamljs').load('api/swagger/swagger.yaml');

var webConfig = require('../app').web();
var sessionsConfig = require('../app').sessions();
var usersConfig = require('../app').users();
var kryptoConfig = require('../app').krypto();
var dbConfig = require('../app').db();

var krypto = require('../authentication/krypto');

var queries = require('../../models/neo4j/rest_api/queries');
var params = require('../../models/neo4j/rest_api/params');
var callbacks = require('../../models/neo4j/rest_api/callbacks')(api);
var errorHandlers = require('../../models/neo4j/rest_api/errorHandlers');
var requests = require('../../models/neo4j/rest_api/requests');

var localesMenuApp = require('../locales/locales_menu_app');
var localesCommandsApp = require('../locales/locales_commands_app');
var localesUserApp = require('../locales/locales_user_app');
var localesUnitsApp = {};
var localesStringsGraph = require('../locales/locales_strings_graph');
var localesStringsMovies = require('../locales/locales_strings_movies');
var localesStringsPersons = require('../locales/locales_strings_persons');

var users = {
  usersConfig: usersConfig,
  krypto: krypto(kryptoConfig),
}

var userDB = require('../../models/redis/node_redis/userDB')
               .call(users);

var context = {
  index: {
    crudTypes: [],      // @TODO: Not used yet, better taken from Swagger ? Does each nodetype require own CRUDs? Global?
    supportedLocales: ['de', 'en', 'es', 'fr'], 
    defaultLocale: 'en',
    strings: localesStringsGraph,
    movieQueries: queries.movies(),
    params: params,
    callbacks: callbacks,
    requests: requests.db(dbConfig),
    userDB: userDB,
    // sessionDB: sessionDB,
  },
  graph: {
    type: 'graph',
    // subTypes: ['relationship'],
    templateFolder: 'graph',
    relationshipTypes: ['ACTED_IN', 'DIRECTED', 'FOLLOWS', 'PRODUCED', 'REVIEWED', 'WROTE'],
    strings: localesStringsGraph,
    queries: queries.graph(),
    params: params,
    callbacks: callbacks,
    requests: requests.db(dbConfig, errorHandlers),
    movieQueries: queries.movies(),
    personQueries: queries.persons(),
    relationships: {
      type: 'relationship',
      typePlural: 'relationships',
    },
    search: {
      type: 'search',
    }
  },
  nodes:{
    movies: {
      nodeType: 'movie',
      nodeTypePlural: 'movies',
      name: 'Movie',
      namePlural: 'Movies',
      templateFolder: 'movies',
      properties: ['title', 'tagline', 'released'], // Not used yet, better taken from Swagger ?
      inQueryParams: ['released'],                  // Not used yet, better taken from Swagger ?
      strings: localesStringsMovies,
      queries: queries.movies(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig, errorHandlers),
      search: {
        type: 'search',
      },
    },
    persons: {
      nodeType: 'person',
      nodeTypePlural: 'persons',
      name: 'Person',
      namePlural: 'Persons',
      templateFolder: 'persons',
      properties: ['name', 'born'],     // Not used yet, better taken from Swagger ?
      inQueryParams: ['born'],          // Not used yet, better taken from Swagger ?
      strings: localesStringsPersons,
      queries: queries.persons(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig, errorHandlers),
      search: {
        type: 'search',
      },
    },
  },
};

var localesUnfiltered = {
  defaultLocale: context.index.defaultLocale,
  supportedLocales: context.index.supportedLocales,
  menu: localesMenuApp,
  commands: localesCommandsApp,
  user: localesUserApp,
  units: localesUnitsApp,
  graph: localesStringsGraph,
  movies: localesStringsMovies,
  persons: localesStringsPersons,   
};

var localesUtils = require('../locales/utils/locales_utils')
                     .call(localesUnfiltered);

var context_html_web_index = require('../../api/controllers/html_web_index')
                               .call(context.index, api, localesUtils); // (context.index.defaultLocale, context.index.supportedLocales, localesMenuApp, localesCommandsApp, localesUnitsApp, localesStringsGraph, localesStringsMovies, localesStringsPersons));

var context_json_api_graph = require('../../api/controllers/json_api_graph')
                               .call(context.graph, api); 

var context_json_api_movies = require('../../api/controllers/json_api_nodes')
                               .call(context.nodes.movies, api); 

var context_json_api_persons = require('../../api/controllers/json_api_nodes')
                               .call(context.nodes.persons, api); 

var context_html_web_graph = require('../../api/controllers/html_web_graph')
                               .call(context.graph, api, localesUtils); //(context.index.defaultLocale, context.index.supportedLocales, localesMenuApp, localesCommandsApp, localesUnitsApp, localesStringsGraph, localesStringsMovies, localesStringsPersons));

var context_html_web_movies = require('../../api/controllers/html_web_nodes')
                               .call(context.nodes.movies, api, localesUtils); //(context.index.defaultLocale, context.index.supportedLocales, localesMenuApp, localesCommandsApp, localesUnitsApp, localesStringsGraph, localesStringsMovies, localesStringsPersons));

var context_html_web_persons = require('../../api/controllers/html_web_nodes')
                               .call(context.nodes.persons, api, localesUtils); //(context.index.defaultLocale, context.index.supportedLocales, localesMenuApp, localesCommandsApp, localesUnitsApp, localesStringsGraph, localesStringsMovies, localesStringsPersons));

module.exports = {
  webConfig: webConfig,
  sessionsConfig: sessionsConfig,
  userDB: userDB,
  context_html_web_index: context_html_web_index,
  context_json_api_graph: context_json_api_graph,
  context_json_api_movies: context_json_api_movies,
  context_json_api_persons: context_json_api_persons,
  context_html_web_graph: context_html_web_graph,
  context_html_web_movies: context_html_web_movies,
  context_html_web_persons: context_html_web_persons,
};

