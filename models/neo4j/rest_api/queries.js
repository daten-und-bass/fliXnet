'use strict';

var queries = {
  graph: function() {
    var queries = {
      readAllGraph: 'MATCH path = (n)-[r]->(m) RETURN path',
      readGraphOfMovie: 'MATCH path = (n:Movie)-[r]-(m) WHERE id(n)={id} RETURN path',
      readGraphOfPerson: 'MATCH path = (n:Person)-[r]-(m) WHERE id(n)={id} RETURN path',
      relationships:{
        create_ACTED_IN: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:ACTED_IN {roles: {property} }]->(m) RETURN p.name, type(r), id(r), m.title, r.roles',
        create_DIRECTED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:DIRECTED]->(m) RETURN p.name, type(r), id(r), m.title',
        create_FOLLOWS: 'MATCH (p:Person), (p2:Person) WHERE id(p)={source} AND id(p2)={target} CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), id(r), p2.name', 
        create_PRODUCED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:PRODUCED]->(m) RETURN p.name, type(r), id(r), m.title',
        create_REVIEWED: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:REVIEWED {summary: {property} }]->(m) RETURN p.name, type(r), id(r), m.title, r.summary',
        create_WROTE: 'MATCH (p:Person), (m:Movie) WHERE id(p)={source} AND id(m)={target} CREATE (p)-[r:WROTE]->(m) RETURN p.name, type(r), id(r), m.title',
        read: 'MATCH (m)-[r]->(n) WHERE id(r)={id} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
        readAllPaginated: 'MATCH (s)-[r]->(t) RETURN coalesce(s.name, s.title), type(r), r, coalesce(t.name, t.title), id(r) ORDER BY type(r) SKIP {offset} LIMIT {amount}',
        getUpdate: 'MATCH (m)-[r]->(n) WHERE id(r)={id} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
        update_ACTED_IN: 'MATCH (m)-[r]->(n) WHERE id(r)={id} SET r.roles={property} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',   
        update_REVIEWED: 'MATCH (m)-[r]->(n) WHERE id(r)={id} SET r.summary={property} RETURN coalesce(m.title, m.name), type(r), coalesce(n.title, n.name), coalesce(r.roles, r.summary)',
        delete: 'MATCH ()-[r]->() WHERE id(r)={id} DELETE r',
      },
      search: {
        labelsAmountNodes: 'MATCH (n) RETURN labels(n), count(*)',
        typeAmountRelationships: 'MATCH (n)-[r]->(m) RETURN type(r), count(r) ORDER BY count(r) DESC',
        topPersons: {
          ACTED_IN: 'MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) RETURN p.name AS Person, id(p) AS PersonId, count(*) AS AmountRoles, collect(m.title) AS Movies, collect(id(m)) AS MovieIds ORDER BY AmountRoles DESC LIMIT 4',
        },
        movieCast: 'MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) WHERE id(m)={id} RETURN p.name, id(p), size(r.roles), r.roles' ,
        topColleagues: {
          ACTED_IN: 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(c:Person) WHERE id(p)={id} RETURN c.name, id(c), count(m), collect(m.title), collect(id(m)) ORDER BY count(m) DESC LIMIT 4',
        },
        // Do NOT do this in production! No relevance, no performace! It touches every node and all its properties accross the whole graph coalesce
        searchField: 'MATCH (n) WHERE n.title=~{searchParam} OR n.tagline=~{searchParam} OR n.released=toInt({searchParam}) OR n.name=~{searchParam} OR n.born=toInt({searchParam}) RETURN DISTINCT n AS n, NULL AS m, NULL AS r UNION MATCH (n)-[r]->(m) WHERE n.title=~{searchParam} OR n.tagline=~{searchParam} OR n.released=toInt({searchParam}) OR n.name=~{searchParam} OR n.born=toInt({searchParam}) OR ANY(label IN labels(n) WHERE label=~{searchParam}) OR m.title=~{searchParam} OR m.tagline=~{searchParam} OR m.released=toInt({searchParam}) OR m.name=~{searchParam} OR m.born=toInt({searchParam}) OR ANY(label IN labels(m) WHERE label=~{searchParam}) OR ANY(role IN r.roles WHERE role=~{searchParam}) OR type(r)=~{searchParam} OR r.summary=~{searchParam} RETURN DISTINCT n AS n, m AS m, r AS r',
      },
    };
    
    return queries;
  },

  movies: function() {
    var queries = {
      create: 'CREATE (m:Movie {properties}) RETURN m, id(m)',
      read: 'MATCH (m:Movie) WHERE id(m)={id} RETURN m',
      readBulkParam: 'MATCH (m:Movie { released: {released} }) RETURN m',
      readBulkWhereNotExistsParam: 'MATCH (m:Movie) WHERE NOT exists(m.released) RETURN m',
      readBulkNoParam: 'MATCH (m:Movie) RETURN m',
      getUpate: 'MATCH (m) WHERE id(m)={id} RETURN m',
      update: 'MATCH (m) WHERE id(m)={id} SET m={properties} RETURN m',
      delete: 'MATCH (m) WHERE id(m)={id} DETACH DELETE m',
      search: {
        distinctProperties: {
          released: 'MATCH (m:Movie) WITH m ORDER BY m.released RETURN collect(DISTINCT m.released), all (x in collect(m) WHERE exists(x.released))',
        },
        readLatestFourNodes: 'MATCH (m:Movie) RETURN m ORDER BY m.released DESC LIMIT 4',
        readAllTitles: 'MATCH (m:Movie) RETURN m.title, id(m) ORDER BY m.title',
      },
    };

    return queries;
  },

  persons: function() {
    var queries = {
      create: 'CREATE (p:Person {properties}) RETURN p, id(p)',
      read: 'MATCH (p:Person) WHERE id(p)={id} RETURN p',
      readBulkParam: 'MATCH (p:Person { born: {born} }) RETURN p',
      readBulkWhereNotExistsParam: 'MATCH (p:Person) WHERE NOT exists(p.born) RETURN p',
      readBulkNoParam: 'MATCH (p:Person) RETURN p',
      getUpate: 'MATCH (p) WHERE id(p)={id} RETURN p',
      update: 'MATCH (p) WHERE id(p)={id} SET p={properties} RETURN p',
      delete: 'MATCH (p) WHERE id(p)={id} DETACH DELETE p',
      search: {
        distinctProperties: {
          born: 'MATCH (p:Person) WITH p ORDER BY p.born RETURN collect(DISTINCT p.born), all (x in collect(p) WHERE exists(x.born))',
        },
        readAllNames: 'MATCH (p:Person) RETURN p.name, id(p) ORDER BY p.name',
      }
    };

    return queries;
  },
};

module.exports = queries;
