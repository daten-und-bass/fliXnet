'use strict';
var chai = require('chai');
var request = require('request');
var expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var urlsToTest = ['/de', '/en', '/es', '/fr'];

describe('/{locale}', function() {
  describe('get', function() {

    urlsToTest.forEach(function (currentValue) {
      it('should respond with 200 Success', function(done) {
        request({
          timeout: 4000,
          url: 'https://localhost:10011' + currentValue,
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
          timeout: 4000,
          url: 'https://localhost:10011' + currentValue + '/ee',
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
