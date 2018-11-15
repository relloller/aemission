'use strict';

const assert = require('assert');
const uuid = require('uuid');
const request = require("request");
const base_url = "http://localhost:8888/api";
let jtoken = '';
const username = 'guest' + uuid.v1();
const password = 'password';
const email = username+"@javascriptjs.com";



describe("aemission", function() {

    describe('GET /api', function() {
        it("returns status code 200 and 'aemission /api'", function(done) {
            request.get(base_url, function(error, response, body) {
                assert.equal(response.statusCode, 200);
                assert.equal("aemission /api", body);
                done();
            });
        });
    });

    describe("POST /api/register", function() {

        it("returns 200 status, and JWT token", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                json: { email, password }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 200);
                assert.equal(typeof body.token, 'string');
                jtoken = body.token;
                done();
            })
        });

       

        it("returns status code 409 for attempted registration of existing email", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                json: {email, password}
            }, function(error, res, body) {
                assert.equal(res.statusCode, 409);
                done();
            })
        });

        it("returns status code 406 for incomplete field(s)", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                json: {
                   email:''
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 406);
                done();
            });
        });
    });

    // describe("POST /api/login", function() {

    //     it("returns 200 status code, username, and JWT token", function(done) {
    //         request({
    //             method: 'POST',
    //             uri: base_url + '/login',
    //             headers: {
    //                 'Authorization': 'Basic ' + asciiB64(username + ':' + password)
    //             }
    
    //         }, function(error, res, body) {
    //             var bodyJSON = JSON.parse(body);
    //             assert.equal(res.statusCode, 200);
    //             assert.equal(typeof bodyJSON.token, 'string');
    //             assert.equal(bodyJSON.username, username);
    //             done();
    //         });
    //     });

    //     it("returns 401 status code and msg 'username/pw not valid' for incorrect password", function(done) {
    //         request({
    //             method: 'POST',
    //             uri: base_url + '/login',
    //             headers: {
    //                 'Authorization': 'Basic ' + asciiB64(username + ':' + 'foobarpw')
    //             }
    //         }, function(error, res, body) {
    //             assert.equal(res.statusCode, 401);
    //             assert.equal(body, "username/pw not valid");
    //             done();
    //         });
    //     });

    //     it("returns 401 status code and msg 'username/pw not valid' for incorrect username", function(done) {
    //         request({
    //             method: 'POST',
    //             uri: base_url + '/login',
    //             headers: {
    //                 'Authorization': 'Basic ' + asciiB64(uuid.v1() + ':' + password)
    //             }
    //         }, function(error, res, body) {
    //             assert.equal(res.statusCode, 401);
    //             assert.equal(body, "username/pw not valid");
    //             done();
    //         });
    //     });
    // });

    // describe("POST /api/auth", function () {
    //     it("returns status code 200 and 'OK Auth Token' with valid Bearer JWT", function(done){
    //         request({
    //             method: 'POST',
    //             uri: base_url + '/auth',
    //             headers: {
    //                 'Authorization': 'Bearer ' + jtoken
    //             }
    //         }, function(error, res, body) {
    //             assert.equal(res.statusCode, 200);
    //             assert.equal(body, 'OK Auth Token');
    //             done();
    //         });
    //     });

    //     it("returns status code 401 and 'Invalid Auth Token' with invalid Bearer JWT", function(done){
    //         request({
    //             method: 'POST',
    //             uri: base_url + '/auth',
    //             headers: {
    //                 'Authorization': 'Bearer ' + 'notvalidtoken'
    //             }
    //         }, function(error, res, body) {
    //             assert.equal(res.statusCode, 401);
    //             assert.equal(body, 'Invalid Auth Token');
    //             done();
    //         });
    //     })
    // })

});
