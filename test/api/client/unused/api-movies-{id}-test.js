// 'use strict';
// var chai = require('chai');
// var ZSchema = require('z-schema');
// var customFormats = module.exports = function(zSchema) {
//   // Placeholder file for all custom-formats in known to swagger.json
//   // as found on
//   // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

//   var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

//   /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
//   zSchema.registerFormat('double', function(val) {
//     return !decimalPattern.test(val.toString());
//   });

//   /** Validates value is a 32bit integer */
//   zSchema.registerFormat('int32', function(val) {
//     // the 32bit shift (>>) truncates any bits beyond max of 32
//     return Number.isInteger(val) && ((val >> 0) === val);
//   });

//   zSchema.registerFormat('int64', function(val) {
//     return Number.isInteger(val);
//   });

//   zSchema.registerFormat('float', function(val) {
//     // should parse
//     return Number.isInteger(val);
//   });

//   zSchema.registerFormat('date', function(val) {
//     // should parse a a date
//     return !isNaN(Date.parse(val));
//   });

//   zSchema.registerFormat('dateTime', function(val) {
//     return !isNaN(Date.parse(val));
//   });

//   zSchema.registerFormat('password', function(val) {
//     // should parse as a string
//     return typeof val === 'string';
//   });
// };

// customFormats(ZSchema);

// var validator = new ZSchema({});
// var request = require('request');
// var expect = chai.expect;

// require('dotenv').load();

// describe('/api/movies/{id}', function() {
//   describe('get', function() {
//     it('should respond with 200 Success', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "movie"
//         ],
//         "properties": {
//           "movie": {
//             "type": "object",
//             "required": [
//               "title"
//             ],
//             "properties": {
//               "tagline": {
//                 "type": "string"
//               },
//               "title": {
//                 "type": "string"
//               },
//               "released": {
//                 "type": "integer"
//               }
//             }
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal(200);

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//     it('should respond with default Error', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "message"
//         ],
//         "properties": {
//           "message": {
//             "type": "string"
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal('DEFAULT RESPONSE CODE HERE');

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//   });

//   describe('put', function() {
//     it('should respond with 200 Success', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "movie"
//         ],
//         "properties": {
//           "movie": {
//             "type": "object",
//             "required": [
//               "title"
//             ],
//             "properties": {
//               "tagline": {
//                 "type": "string"
//               },
//               "title": {
//                 "type": "string"
//               },
//               "released": {
//                 "type": "integer"
//               }
//             }
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + process.env.OAUTH_2
//         },
//         json: {
//           movie: 'DATA GOES HERE'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal(200);

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//     it('should respond with default Error', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "message"
//         ],
//         "properties": {
//           "message": {
//             "type": "string"
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + process.env.OAUTH_2
//         },
//         json: {
//           movie: 'DATA GOES HERE'
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal('DEFAULT RESPONSE CODE HERE');

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//   });

//   describe('delete', function() {
//     it('should respond with 200 Success', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "nodes_deleted"
//         ],
//         "properties": {
//           "nodes_deleted": {
//             "type": "integer"
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + process.env.OAUTH_2
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal(200);

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//     it('should respond with default Error', function(done) {
//       /*eslint-disable*/
//       var schema = {
//         "required": [
//           "message"
//         ],
//         "properties": {
//           "message": {
//             "type": "string"
//           }
//         }
//       };

//       /*eslint-enable*/
//       request({
//         url: 'https://localhost:10011/api/movies/{id PARAM GOES HERE}',
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + process.env.OAUTH_2
//         }
//       },
//       function(error, res, body) {
//         if (error) return done(error);

//         expect(res.statusCode).to.equal('DEFAULT RESPONSE CODE HERE');

//         expect(validator.validate(body, schema)).to.be.true;
//         done();
//       });
//     });

//   });

// });
