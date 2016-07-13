
var movie = function (spec, my) {
  // my = my || {};
  var that = {
    id:     function () { return spec.id; },            // Integer (min=0), Provided by DB
    labels: function () { return spec.labels }          // Array of Strings (each one Word only)
    properties: {
      title:     function () { return spec.title; },    // Required, String (short)
      tagline:   function () { return spec.tagline; },  // String (longer)
      released:  function () { return spec.released; }, // Integer (min=0, max?)
    },
  };

  return that;
};


var person = function (spec, my) {
  // my = my || {};
  var that = {
    id:     function () { return spec.id; },            // Integer (min=0), Provided by DB
    labels: function () { return spec.labels }          // Array of Strings (each one Word only)
    properties: {
      name:       function () { return spec.name; },    // Required, String (short)
      born:       function () { return spec.born; },    // String (longer)
    },
  };

  return that;
};
