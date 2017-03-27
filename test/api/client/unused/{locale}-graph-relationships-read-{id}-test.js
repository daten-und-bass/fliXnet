// 'use strict';
// var chai = require('chai');
// var request = require('request');
// var expect = chai.expect;

// describe('/{locale}/graph/relationships/read/{id}', function() {
//   describe('get', function() {
//     it('should respond with 200 Success', function(done) {
//       request({
//         url: 'https://localhost:10011/{locale PARAM GOES HERE}/graph/relationships/read/{id PARAM GOES HERE}',
//         method: 'GET',
//         headers: {
//           'Content-Type': 'text/html'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal(200);

//         expect(body).to.equal(null); // non-json response or no schema
//         done();
//       });
//     });

//     it('should respond with default Error', function(done) {
//       request({
//         url: 'https://localhost:10011/{locale PARAM GOES HERE}/graph/relationships/read/{id PARAM GOES HERE}',
//         method: 'GET',
//         headers: {
//           'Content-Type': 'text/html'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal('DEFAULT RESPONSE CODE HERE');

//         expect(body).to.equal(null); // non-json response or no schema
//         done();
//       });
//     });

//   });

// });
