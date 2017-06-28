'use strict';
var chai = require('chai');
var request = require('request');
var expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var urlsToTest = ['/de/contact', '/en/contact', '/es/contact', '/fr/contact'];

describe('/{locale}/contact', function() {
  describe('get', function() {
    
    this.timeout(6000);

    urlsToTest.forEach(function (currentValue) {
      it('should respond with 200 Success', function(done) {
        request({
          timeout: 6000,
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
          timeout: 6000,
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
