'use strict';
var chai = require('chai');
var request = require('request');
var expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var urlsToTest = ['/de', '/en', '/es', '/fr'];


describe('/{locale}/persons', function() {
  describe('get', function() {

    urlsToTest.forEach(function (currentValue) {
      it('should respond with 200 Success', function(done) {
        request({
          url: 'https://localhost:10011' + currentValue + '/persons',
          method: 'GET',
          headers: {
            'Content-Type': 'text/html'
          }
        },
        function(error, res, body) {
          if (error) return done(error);

          expect(res.statusCode).to.equal(200);

          expect(body).to.not.equal(null); // non-json response or no schema
          done();
        });
      });

      it('should respond with 200 Success for qs 1978', function(done) {
        request({
          url: 'https://localhost:10011' + currentValue + '/persons',
          qs: {
            born: 1978
          },
          method: 'GET',
          headers: {
            'Content-Type': 'text/html'
          }
        },
        function(error, res, body) {
          if (error) return done(error);

          expect(res.statusCode).to.equal(200);

          expect(body).to.not.equal(null); // non-json response or no schema
          done();
        });
      });

      it('should respond with default Error', function(done) {
        request({
          url: 'https://localhost:10011' + currentValue + 'persons/ee',
          method: 'GET',
          headers: {
            'Content-Type': 'text/html'
          }
        },
        function(error, res, body) {
          if (error) return done(error);

          expect(res.statusCode).to.equal(404);

          expect(body).to.not.equal(null); // non-json response or no schema
          done();
        });
      });
    });
  });

});
