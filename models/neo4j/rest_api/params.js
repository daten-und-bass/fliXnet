'use strict';

var paramsToNeo = {};

var params = {
  inBodyParams: {
    set: function(paramsFromSwagger, nodeType) {
      paramsToNeo = {};

      Object.keys(paramsFromSwagger).forEach(function(key) {
        if(key === 'id') { 
            paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
          } else {
            paramsToNeo[key] = paramsFromSwagger[key].value;
          }
      });

      paramsToNeo.properties = {};

      Object.keys(paramsFromSwagger[nodeType].value[nodeType]).forEach(function(key) {
        paramsToNeo.properties[key] = paramsFromSwagger[nodeType].value[nodeType][key];
      });

      return paramsToNeo;
    },

    get: function() {
      return paramsToNeo;
    },
  },
  otherParams: {
    set: function(paramsFromSwagger) {
      paramsToNeo = {};
      paramsToNeo.properties = {};

      Object.keys(paramsFromSwagger).forEach(function(key) {
        if(key !== 'locale') {
          if(key === 'id') { 
            paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
          } else if (key === 'source' || key === 'type' || key === 'target' || key === 'property' || key === 'rating') {
            if (isNaN(paramsFromSwagger[key].value)) {
              paramsToNeo[key] = paramsFromSwagger[key].value;
            } else {
              paramsToNeo[key] = parseInt(paramsFromSwagger[key].value);
            }
            if (key === 'property' ) { 
              if (paramsFromSwagger.type.value === 'ACTED_IN') {
                var arrStrings = [];
                arrStrings = paramsFromSwagger[key].value.trim().replace(/ /g, '').split(',')
                paramsToNeo[key] = arrStrings;
              }
              if (paramsFromSwagger.type.value === 'REVIEWED') {
                paramsToNeo[key] = paramsFromSwagger[key].value
              }
            }
          } else if (paramsFromSwagger[key].schema.in === 'query' ) {
            if (key === 'searchParam') {
              if (isNaN(paramsFromSwagger[key].value)) {
                paramsToNeo[key] = '';
                paramsFromSwagger[key].value.split(' ').forEach(function (element) {
                  paramsToNeo[key] += '(?i).*' + element + '.*';
                })
              } else {
                paramsToNeo[key] = paramsFromSwagger[key].value;
              } 
            } else {
                paramsToNeo[key] = paramsFromSwagger[key].value;
            }
          } else {
            paramsToNeo.properties[key] = paramsFromSwagger[key].value;
          }
        }
      });
      console.log(paramsToNeo);
      return paramsToNeo;
    },

    get: function() {
      return paramsToNeo;
    },
  },
};

module.exports = params;
