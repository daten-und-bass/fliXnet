'use strict';

var app = (function() {

  var paginationNodesTable = 1;
  var paginationGraphTable = 0;

  function searchField(event, locale) {
    var searchField = document.getElementById('search-field');
    if (event.keyCode == 13 && searchField.value.length > 0) {
      location.path = ''
      return location = '/' + locale + '/graph/search/searchField?searchParam=' + encodeURIComponent(searchField.value);
      } else {
      return false;
    }  
  }

  function changeLocale(currentLocale, newLocale) {
    var searchParam = location.search;
    var newLocation = location.pathname.replace('/' + currentLocale + '/', newLocale + '/');
    newLocation += searchParam;
    
    location.assign(newLocation);
  }

  function changeLocationReadBulk(location, year, paramName) {
    if(isNaN(year)) {
      return self.location = self.location.pathname;
    } else {
      return self.location = location + '?' + paramName + '=' + year;   
    }
  }

  function changeLocationSearch(locale, nodeType, nodeId) {
    self.location.path = ''
    return self.location = '/' + locale + '/' + nodeType + '/read/' + nodeId;
  }

  function visualizeGraphDiv(url, locale, width, height, charge) {

    var force = d3.layout.force()
        .size([width, height])
        .friction(0.75)
        .charge(charge)
        .linkDistance(40)
        .gravity(0.25);

    var drag = force.drag()
        .on("dragstart", dragstart);

    document.getElementById("graph").removeAttribute("class");

    var svg = d3.select('#graph').append('svg')
        .attr('viewBox', '0 0 1044 ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    var color = d3.scale.ordinal()
        .domain(['Movie','Person'])
        .range(['#8bc34a', '#757575']);

    d3.json(url, function(error, graph) {
      if (error) throw error;

      var relationships =  graph.graph.links;
      var nodes = graph.graph.nodes;

      relationships.forEach(function (l, index) {
        if (!l.linkCount) { l.linkCount = 1; }
        var linkCount2 = 1;
        relationships.forEach(function (l2, index2) {
          if(relationships[index].source === relationships[index2].source && relationships[index].target === relationships[index2].target){                  
            l2.linkCount = linkCount2++;
          } 
        });
      });

      force.nodes(nodes).links(relationships).start();

      var link = svg.selectAll('link')
          .data(relationships)
          .enter().append('g')
          .attr('class', 'link');

      var linkLine = link.append('line');  

      var linkText = link.append("svg:a")
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', function(d) { return 1 - d.linkCount + 'em'; })
          .text(function(d) { return d.value; });

      var node = svg.selectAll('node')
          .data(nodes)
          .enter().append('g')
          .attr('class', 'node')
          .call(drag);

      var nodeIcon = node.append('text')
          .text(function(d) {
            if(d.label === 'Movie') { return '\ue02c'; } 
            if(d.label === 'Person') { return '\ue7fd'; } })
          .attr('class', 'material-icons')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('fill', function(d) { return color(d.label); });
     
      var nodeTextRect = node.append('rect')
          .attr('id', function(d) { return 'nodeTextRect_' + d.id; })
          .attr('class', 'nodeTextRect')
          .style('stroke', function(d) { return color(d.label); });

      var nodeText = node.append("svg:a")
          .attr("xlink:href", function(d){
           if(d.name === undefined) { return '/' + locale + '/movies/read/' + d.id;} 
           if(d.title === undefined) { return '/' + locale + '/persons/read/' + d.id; }})
          .append('text')
          .text(function(d) {
            if(d.name === undefined) { return d.title; } 
            if(d.title === undefined) { return d.name; } })
          .attr('id', function(d) { return 'nodeText_' + d.id; })
          .attr('class', 'nodeText')
          .attr('dy', '.35em')
          .style('fill', function(d) { return color(d.label); });

      linkText.on('dblclick', function (d) {return self.location = '/' + locale + '/graph/relationships/read/' + d.id;});

      node.on('dblclick', dblclick);

      nodeIcon.on('mouseenter', mouseenter);

      nodeIcon.on('mouseleave', mouseleave);   

      force.on('tick', function() {

        linkLine.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

        linkText.attr('transform', function(d) {
              var angle = Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) * 180 / Math.PI;
              if(isNaN(angle)) { angle = 0; }
              return 'translate(' + [((d.source.x + d.target.x) / 2), ((d.source.y + d.target.y) / 2)] + ')rotate(' + angle + ')';
            });

        nodeIcon.attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; });

        nodeTextRect.attr('x', function (d) { return d.x+22; })
                    .attr('y', function (d) { return d.y-10; });

        nodeText.attr('x', function (d) { return d.x+27; })
                .attr('y', function (d) { return d.y; });
      }); 

    });

    function dblclick(d) {
      d3.select(this).classed("fixed", d.fixed = false);
      d3.select(this).selectAll('.material-icons').on('mouseleave', mouseleave);
      d3.select(this).selectAll('.nodeText').style({display:'none'}); 
      d3.select(this).selectAll('.nodeTextRect').style({display:'none'});
    }

    function dragstart(d) {
      d3.select(this).classed("fixed", d.fixed = true);
      d3.select(this).selectAll('.material-icons').on('mouseleave', null);
      d3.select(this).selectAll('.nodeText').style({display:'inline'}); 
      d3.select('#nodeTextRect_' + d.id)
          .style({display:'inline'})
          .attr('width', function(d) { return document.getElementById('nodeText_' + d.id).getBBox().width + 10; })
          .attr('height', 20);
    }

    function mouseenter(d) {
      d3.select(this).style('font-size', 'xx-large');
      d3.select(this.parentNode).selectAll('.nodeText')
        .style({display:'inline'});
      d3.select('#nodeTextRect_' + d.id)
        .style({display:'inline'})
        .attr('width', function(d) { return document.getElementById('nodeText_' + d.id).getBBox().width + 10; })
        .attr('height', 20);
    }

    function mouseleave(d) {
      d3.select(this).style('font-size', 24);
      d3.select(this.parentNode).selectAll('.nodeText').style({display:'none'}); 
      d3.select(this.parentNode).selectAll('.nodeTextRect').style({display:'none'});
    }  
  }

  function createNodesTableBody(element, url) {
    var elementArray = [];
    var oldTBody = document.getElementById(element);
    var newTBody = document.createElement('tbody');
    newTBody.id = 'nodesTableBody';
    var documentFragment = document.createDocumentFragment();

    var spinner = document.createElement('div');
    spinner.className = 'mdl-spinner mdl-js-spinner is-active flixnet-spinner';

    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // elementArray = JSON.parse(xhr.responseText).data;
        elementArray = parseJsonTryer(xhr.responseText).data;
        elementArray.forEach(function (element, index) {

          var outerTr = document.createElement('tr');
            var innterTd1 = document.createElement('td');
            innterTd1.textContent = elementArray[index].row[0];
            innterTd1.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd1);
            var innterTd2 = document.createElement('td');
            innterTd2.textContent = elementArray[index].row[1];
          outerTr.appendChild(innterTd2);
          documentFragment.appendChild(outerTr);
        });
        newTBody.removeChild(spinner);
        newTBody.appendChild(documentFragment);
        if (oldTBody.parentNode) { oldTBody.parentNode.replaceChild(newTBody, oldTBody); }
      } else {
        if (!newTBody.hasChildNodes()) { 
          newTBody.appendChild(spinner); 
          if (oldTBody.parentNode) { oldTBody.parentNode.replaceChild(newTBody, oldTBody); }
        }
      }
    };
    xhr.send();
  }

  function paginateNodesTableBodyBothWays(relationshipsString, nodesString) {
    var url;
    switch (paginationNodesTable) {
      case 0:
        url = '/api/graph/search/typeAmountRelationships';
        document.getElementById('nodesTableBodyI').textContent = 'linear_scale';
        document.getElementById('nodesTableBodyH').textContent = relationshipsString;
        document.getElementById('nodesTableBodyTh').textContent = 'Type';
        paginationNodesTable = paginationNodesTable +1;
        break;
      case 1:
        url = '/api/graph/search/labelsAmountNodes';
        document.getElementById('nodesTableBodyI').textContent = 'grain';
        document.getElementById('nodesTableBodyH').textContent = nodesString;
        document.getElementById('nodesTableBodyTh').textContent = 'Label';
        paginationNodesTable = paginationNodesTable -1;
        break;
      default:
        console.log('Default case.');
    } 
    createNodesTableBody('nodesTableBody', url);
  }

  function createGraphTableBody(element, url, locale) {
    var elementArray = [];
    var oldTBody = document.getElementById(element);
    var newTBody = document.createElement('tbody');
    newTBody.id = 'graphTableBody';
    var documentFragment = document.createDocumentFragment();

    var spinner = document.createElement('div');
    spinner.className = 'mdl-spinner mdl-js-spinner is-active flixnet-spinner';

    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url + paginationGraphTable));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // elementArray = JSON.parse(xhr.responseText).data;
        elementArray = parseJsonTryer(xhr.responseText).data;
        elementArray.forEach(function (element, index) {

          var outerTr = document.createElement('tr');
            var innterTd1 = document.createElement('td');
            innterTd1.textContent = elementArray[index].row[0];
            innterTd1.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd1);
            var innterTd2 = document.createElement('td');
            innterTd2.textContent = elementArray[index].row[1];
            innterTd2.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd2);
            var innterTd3 = document.createElement('td');
            innterTd3.textContent = JSON.stringify(elementArray[index].row[2]);
            innterTd3.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd3);
            var innterTd4 = document.createElement('td');
            innterTd4.textContent = elementArray[index].row[3];
            innterTd4.className = 'mdl-data-table__cell--non-numeric';
          outerTr.appendChild(innterTd4);
          outerTr.style.cursor = 'pointer';
          outerTr.onclick = function () {return self.location = '/' + locale + '/graph/relationships/read/' + elementArray[index].row[4];};

          documentFragment.appendChild(outerTr);
        });

        if(paginationGraphTable < 6) {
          document.getElementById('graphTableBodyBackward').style.opacity = 0.46;
          document.getElementById('graphTableBodyBackward').onclick = '';
        } else {
          document.getElementById('graphTableBodyBackward').style.opacity = 1.00;
          document.getElementById('graphTableBodyBackward').onclick = paginateGraphTableBodyBackward;
        }

        if (elementArray.length < 6) {
          document.getElementById('graphTableBodyForward').style.opacity = 0.46;
          document.getElementById('graphTableBodyForward').onclick='';
        } else {
          document.getElementById('graphTableBodyForward').style.opacity = 1.00;
          document.getElementById('graphTableBodyForward').onclick = paginateGraphTableBodyForward;
        }
        
        newTBody.removeChild(spinner);
        newTBody.appendChild(documentFragment);
        if (oldTBody.parentNode) { oldTBody.parentNode.replaceChild(newTBody, oldTBody); }

      } else {
        if (!newTBody.hasChildNodes()) { 
          newTBody.appendChild(spinner); 
          if (oldTBody.parentNode) { oldTBody.parentNode.replaceChild(newTBody, oldTBody); }
        }
      }
    };
    xhr.send();

    function paginateGraphTableBodyBackward() {
      paginationGraphTable = paginationGraphTable - 6;
      createGraphTableBody('graphTableBody', '/api/graph/relationships/readAllPaginated?pagination=', locale);
    }

    function paginateGraphTableBodyForward() {
      paginationGraphTable = paginationGraphTable + 6;
      createGraphTableBody('graphTableBody', '/api/graph/relationships/readAllPaginated?pagination=', locale);
    }
  }

  function createNodesMdlCardsDiv(element, url, locale, showString) {

    var elementArray = [];
    var documentFragment = document.createDocumentFragment();
    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        elementArray = parseJsonTryer(xhr.responseText).data;
        
        if (element === 'TopColleagues' && elementArray.length === 0) {
          document.getElementById('OptionalTopColleagues').style.display = 'none';
        }
        
        elementArray.forEach(function (currentElement, index) {
          var outerDiv = document.createElement('div');
          outerDiv.className = 'mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp';

            var innnerDivPersonMedia = document.createElement('div');
            innnerDivPersonMedia.className = 'mdl-card__media';
              var innnerIPersonMedia = document.createElement('i');
                  innnerIPersonMedia.textContent = 'person';
                  innnerIPersonMedia.className ='material-icons';
                  innnerIPersonMedia.style.opacity = '0.76'; 
                  innnerIPersonMedia.style.color = '#37474f';
            innnerDivPersonMedia.appendChild(innnerIPersonMedia);
          outerDiv.appendChild(innnerDivPersonMedia);

            var innnerDivPersonName  = document.createElement('div');
            innnerDivPersonName.className = 'mdl-card__title';
              var innnerH4PersonName = document.createElement('h4');
                  innnerH4PersonName.className = 'mdl-card__title-text';
                  innnerH4PersonName.textContent = elementArray[index].row[0];
            innnerDivPersonName.appendChild(innnerH4PersonName);
          outerDiv.appendChild(innnerDivPersonName);

            var innnerDivRoles = document.createElement('div');
            innnerDivRoles.className = 'mdl-card__title';
              var innnerIMovieMedia = document.createElement('i');
                  innnerIMovieMedia.className = 'material-icons';
                  innnerIMovieMedia.style.opacity = '0.46';
                  if (element === 'MovieCast') {
                    innnerIMovieMedia.textContent = 'perm_contact_calendar \v'; 
                  } else {
                    innnerIMovieMedia.textContent = 'movie \v';
                  }
              var innnerH4AmountRoles = document.createElement('h4');
                  innnerH4AmountRoles.className ='mdl-card__title-text';
                  innnerH4AmountRoles.textContent = elementArray[index].row[2];
            innnerDivRoles.appendChild(innnerIMovieMedia);
            innnerDivRoles.appendChild(innnerH4AmountRoles);
          outerDiv.appendChild(innnerDivRoles);

            var innerDivMovieNames = document.createElement('div');
            innerDivMovieNames.className = 'mdl-card__supporting-text';
              var innerSpanMovieNames = document.createElement('sapn');
              innerSpanMovieNames.className = 'mdl-typography--font-thin';
              elementArray[index].row[3].forEach(function (innerElement, innerIndex){
                var innerAMovieName = document.createElement('a');
                if (element === 'MovieCast') { 
                  innerAMovieName.className = 'mdl-typography--font-light mdl-typography--subhead';
                } else {
                  innerAMovieName.className = 'android-link';
                  innerAMovieName.href = '/' + locale + '/movies/read/' + elementArray[index].row[4][innerIndex];
                }
                
                if (innerIndex === 0) {
                  innerAMovieName.textContent = innerElement ;
                } else {
                  innerAMovieName.textContent = ' | ';
                  innerAMovieName.textContent += innerElement ;
                }

                innerSpanMovieNames.appendChild(innerAMovieName);
              });
            innerDivMovieNames.appendChild(innerSpanMovieNames);
          outerDiv.appendChild(innerDivMovieNames);

            var innerDivActions = document.createElement('div');
            innerDivActions.className = 'mdl-card__actions';
              var innerAActions = document.createElement('a');
                  innerAActions.className = 'android-link mdl-button mdl-js-buttonmdl-typography--text-uppercase';
                  innerAActions.href = '/' + locale + '/persons/read/' + elementArray[index].row[1];
                  innerAActions.textContent = showString;
            innerDivActions.appendChild(innerAActions);
          outerDiv.appendChild(innerDivActions);

          documentFragment.appendChild(outerDiv);
        });
        document.getElementById(element).removeChild(document.getElementById('spinner'+element));
        document.getElementById(element).appendChild(documentFragment);
      }
      else if (xhr.readyState === 4 && xhr.status === 400 || xhr.status === 404 || xhr.status === 500) {

        if (element === 'TopColleagues') {
          document.getElementById('OptionalTopColleagues').style.display = 'none';
          document.getElementById('spinnerTopColleagues').style.display = 'none';  
        }
        if (element === 'MovieCast') {
          document.getElementById('OptionalMovieCast').style.display = 'none';
          document.getElementById('spinnerMovieCast').style.display = 'none';  
        }
      }
    };
    xhr.send();
  }

  function updateLinkDeactivator(updateLink, titleString) {
    updateLink.removeAttribute('href');
    updateLink.removeAttribute('class');
    updateLink.className = 'mdl-button mdl-js-button mdl-typography--text-uppercase';
    updateLink.style.opacity = '0.46';
    updateLink.title = 'This type of relationship cannot be updated.';
  }

  function toggleViewReadRelationship(value, titleString) {
    var property = document.getElementById('property');
    var rating = document.getElementById('rating');
    var updateLink = document.getElementById('updateLink');

    switch(value[1]) {
      case 'ACTED_IN':
        property.style.display = 'block';
        property.textContent = 'as ' + value[3] + '.';
        break;
      case 'DIRECTED':
      case 'PRODUCED':
      case 'WROTE':
      case 'FOLLOWS':
        property.style.display = 'none';
        rating.style.display = 'none';
        updateLinkDeactivator(updateLink, titleString);
        break;
      case 'REVIEWED':
        property.style.display = 'block';
        property.textContent = 'Summary: ' + value[3] + '.';
        if (value[4]) {
          rating.textContent = 'Rating: ' + value[4] + '.';
        } else {
          rating.textContent = 'Rating: n.a.';
        }
        
        break;
      default:
        console.log('default');
    }
  }

  function toggleViewUpdateRelationship(value) {
    var asLabel = document.getElementById('asLabel')
    var property = document.getElementById('property');
    var rating = document.getElementById('rating');
    var asHint = document.getElementById('asHint');

    switch(value[1]) {
      case 'ACTED_IN':
        property.style.display = 'inline';
        asLabel.style.display = 'inline';
        asHint.style.display = 'inline';
        rating.style.display = 'none';
        break;
      case 'DIRECTED':
      case 'PRODUCED':
      case 'WROTE':
      case 'FOLLOWS':
        property.style.display = 'none';
        asLabel.style.display = 'none';
        asHint.style.display = 'none';
        rating.style.display = 'none';
        break;
      case 'REVIEWED':
        asHint.style.display = 'none';
        property.style.display = 'inline';
        rating.style.display = 'inline';
        asLabel.textContent = ' Summary: '
        property.textContent = value[4];
        rating.textContent = value[5];
        break;
      default:
        console.log('default');
    }
  }

  function createOptionsRelationship(persons, relationships, movies) {
    var personsList = optionCreator(persons, '', true);
    var relationshipsList = optionCreator(relationships, '', false);
    var movieList = optionCreator(movies, '', true);

    var source = document.getElementById('source');
    var type = document.getElementById('type');
    var target = document.getElementById('target');
    var asLabel = document.getElementById('asLabel');
    var property = document.getElementById('property');
    var rating = document.getElementById('rating');

    type.onchange = targetFieldChanger;
    
    source.appendChild(personsList.cloneNode(true));
    type.appendChild(relationshipsList.cloneNode(true));
    target.appendChild(movieList.cloneNode(true));

    function targetFieldChanger() {
      var valueText = type.options[type.selectedIndex].value;
      switch(valueText) {
        case 'ACTED_IN':
          target.options.length = 0;
          target.appendChild(movieList.cloneNode(true));
          asLabel.style.display = 'inline';
          asHint.style.display = 'inline';
          property.required = true;
          property.placeholder = 'Role (in English)';
          property.size=20;
          property.style.display = 'inline';
          rating.style.display = 'none';
          break;
        case 'DIRECTED':
        case 'PRODUCED':
        case 'REVIEWED':
        case 'WROTE':
          target.options.length = 0;
          target.appendChild(movieList.cloneNode(true));
          asLabel.style.display = 'none';
          asHint.style.display = 'none';
          if(valueText === 'REVIEWED') {
            property.placeholder='Summary (in English)';
            rating.placeholder='Rating 0-100';
            property.size=50;
            property.style.display = 'inline';
            rating.style.display = 'inline';
            property.required = true;
          } else {
            property.style.display = 'none';
            rating.style.display = 'none';
            property.required = false;
          }  
          break;
        case 'FOLLOWS':
          asLabel.style.display = 'none';
          asHint.style.display = 'none';
          property.style.display = 'none';
          target.options.length = 0;
          property.required = false;
          target.appendChild(personsList.cloneNode(true));
          break;
        default:
          console.log('default');
      }
    }
  }

  function optionCreator(elementArray, unknownString, hasID) {
    var documentFragment = document.createDocumentFragment();
    elementArray.forEach(function(element, index) {
      var option = document.createElement('option');
      if (element === -1) {
        option.textContent = unknownString;
      } else {
        option.textContent = hasID ? element[0] : element;
      } 
      option.value = hasID ? element[1] : element;
      documentFragment.appendChild(option);
    });
    return documentFragment;
  }

  function createOptionsReadBulk(element, url, inQueryParam, unknownString) {
    var xhr = new XMLHttpRequest();
    var distinctValues;
    var isPropertyInAll;

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        
        distinctValues = parseJsonTryer(xhr.responseText).data[0].row[0];;
        isPropertyInAll = parseJsonTryer(xhr.responseText).data[0].row[1];
        if(isPropertyInAll === false) {
          distinctValues.unshift(-1); 
        }        
        element.appendChild(optionCreator(distinctValues, unknownString, false));

        if(inQueryParam.length > 0) {
          element.value = inQueryParam;
        }
      }
    };

    xhr.send();
  }

  function checkInput(inputsArray, checkIcon, checkMessage, checkMessageString, passwordInputsArray) {
    var valid = false;

    valid = inputsArray.every(function (element, index, inputsArray) {
      return element.checkValidity();
    });

    if (passwordInputsArray) {
      valid = (passwordInputsArray[0] && passwordInputsArray[0] === passwordInputsArray[1] );
    }

    if(valid) {
      checkIcon.style.color = 'rgb(76,175,80)';
      checkIcon.innerText = 'check_circle';
      checkMessage.innerText = '';

      return true;
    } else {
      checkIcon.style.color = 'rgb(244,67,54)';
      checkIcon.innerText = 'error';
      checkMessage.innerText = checkMessageString;

      return false;
    }
  }

  function urlValidator(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.status==200;
  }

  function deleteRelationship(url, source, type, target, nodeType, deleteString, deletedString) {
    var txt = deleteString + '?:\n' + '"' + source  + ' ' + type.toLowerCase() + ' ' + target + '"';
    var r = confirm(txt);
    var xhr = new XMLHttpRequest();

    var back;
    if (urlValidator(document.referrer)){
      back = document.referrer;
    } else {
      back = window.location.origin + '/' + nodeType;
    }

    if(r == true) {
      xhr.open('POST', encodeURI(url));
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert(deletedString + ": " + parseJsonTryer(xhr.responseText).relationship_deleted);
          window.location.href = back;
        }
        else if (xhr.readyState === 4 && xhr.status === 404) {
          alert('The relationship to delete no longer exists');
          window.location.href = back;
        }
        else if (xhr.readyState === 4 && xhr.status === 400 || xhr.status === 500) {
          alert('Something went wrong');
          window.location.href = back;
        }
      };
      xhr.send();
    } 
  }

  function deleteNode(url, node, nodeType, deleteString, deletedString) {
    var txt = deleteString + ' ?:\n "' + node + '"';
    var r = confirm(txt);
    var xhr = new XMLHttpRequest();
    var back;

    if (urlValidator(document.referrer)){
      back = document.referrer;
    } else {
      back = window.location.origin + '/' + nodeType;
    }

    if(r == true) {
      xhr.open('POST', encodeURI(url));
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert(deletedString + ': ' + parseJsonTryer(xhr.responseText).nodes_deleted);
          window.location.href = back;
        }
        else if (xhr.readyState === 4 && xhr.status === 404) {
          alert('The node to delete no longer exists');
          window.location.href = back;
        }
        else if (xhr.readyState === 4 && xhr.status === 400 || xhr.status === 500) {
          alert('Something went wrong');
          window.location.href = back;
        }
      };
      xhr.send();
    } 
  }

  function deleteUser(url, user, locale, deleteString, deletedString) {
    var txt = deleteString + ' ?:\n "' + user + '"';
    var r = confirm(txt);
    var xhr = new XMLHttpRequest();

    if(r == true) {
      xhr.open('POST', encodeURI(url));
      xhr.onreadystatechange = function() {
        console.log(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (parseJsonTryer(xhr.responseText).success === true) {
            alert(deletedString + ': ' + user);
            window.location.href = '/' + locale + '/user/logout';
          } else {
            alert('Not deleted:');
            window.location.href = '/' + locale + '/user';
          }
        }
        else if (xhr.readyState === 4 && xhr.status === 404) {
          alert('The user to delete no longer exists');
          window.location.href = '/';
        }
        else if (xhr.readyState === 4 && xhr.status === 400 || xhr.status === 500) {
          alert('Something went wrong');
          window.location.href = '/';
        }
      };
      xhr.send();
    } 
  }

  function parseJsonTryer(jsonToParse) {
    var result;

    try {
      result = JSON.parse(jsonToParse);
    } catch(err) {
      alert(err.message);
    }

    return result;
  }

  return {
    search: {
      searchField: searchField
    },
    locale: {
      changeLocale: changeLocale,
    },
    location: {
      changeLocationReadBulk: changeLocationReadBulk,
      changeLocationSearch: changeLocationSearch,
    },
    visualization: {
      visualizeGraphDiv: visualizeGraphDiv,
    },
    content: { 
      htmlElements: {
        createNodesTableBody: createNodesTableBody,
        paginateNodesTableBodyBothWays: paginateNodesTableBodyBothWays,
        createGraphTableBody: createGraphTableBody,
        createNodesMdlCardsDiv: createNodesMdlCardsDiv,
        toggleViewReadRelationship: toggleViewReadRelationship,
        toggleViewUpdateRelationship: toggleViewUpdateRelationship,
        createOptionsRelationship: createOptionsRelationship,
        createOptionsReadBulk: createOptionsReadBulk,
      },
      validation: {
        checkInput: checkInput,
      },
      userInteraction: {
        deleteRelationship: deleteRelationship,
        deleteNode: deleteNode,
        deleteUser: deleteUser,
      },
    },
  }; 
})();