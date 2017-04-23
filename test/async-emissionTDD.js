'use strict';

var assert = require('assert');
var uuid = require('node-uuid');
var request = require("request");
var base_url = "http://localhost:8080/api";
var jtoken = '';
var username = 'guest' + uuid.v1();
var password = 'passwerd';
var email = username+"@javascriptjs.com";

function asciiB64(asciiStr) {
    var buf = Buffer.from(asciiStr, 'ascii');
    return buf.toString('base64');
}



describe("async-emission", function() {

    describe('GET /api', function() {
        it("returns status code 200 and 'async-emission Demo API'", function(done) {
            request.get(base_url, function(error, response, body) {
                assert.equal(response.statusCode, 200);
                assert.equal("async-emission Demo API", body);
                done();
            });
        });
    });

    describe("POST /api/register", function() {

        it("returns 200 status, username, and JWT token", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(username + ':' + password)
                },
                json: {
                    email: email
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 200);
                assert.equal(typeof body.token, 'string');
                assert.equal(body.username, username);
                jtoken = body.token;
                done();
            })
        });

        it("returns status code 409 and msg 'username exists' for attempted registration of existing username", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(username + ':' + password)
                },
                json: {
                    email: uuid.v1()+"@javascriptjs.com"
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 409);
                assert.equal(body, 'username exists');
                done()
            })
        });

        it("returns status code 409 and msg 'email exists' for attempted registration of existing email", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(uuid.v1() + ':' + password)
                },
                json: {
                    email: email
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 409);
                assert.equal(body, 'email exists');
                done()
            })
        });

        it("returns status code 400 and msg 'All fields required' for incomplete field(s)", function(done) {
            var rnd = Math.floor((Math.random() * 99999) + 1);
            var guestName = 'guest' + rnd.toString();
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(uuid.v1() + ':' + password)
                },
                json: {
                   email:''
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 400);
                assert.equal(body, 'All fields required');
                done();
            });
        });
    });

    describe("POST /api/login", function() {

        it("returns 200 status code, username, and JWT token", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/login',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(username + ':' + password)
                }
    
            }, function(error, res, body) {
                var bodyJSON = JSON.parse(body);
                assert.equal(res.statusCode, 200);
                assert.equal(typeof bodyJSON.token, 'string');
                assert.equal(bodyJSON.username, username);
                done();
            });
        });

        it("returns 401 status code and msg 'username/pw not valid' for incorrect password", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/login',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(username + ':' + 'foobarpw')
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 401);
                assert.equal(body, "username/pw not valid");
                done();
            });
        });

        it("returns 401 status code and msg 'username/pw not valid' for incorrect username", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/login',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(uuid.v1() + ':' + password)
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 401);
                assert.equal(body, "username/pw not valid");
                done();
            });
        });
    });

    describe("POST /api/auth", function () {
        it("returns status code 200 and 'OK Auth Token' with valid Bearer JWT", function(done){
            request({
                method: 'POST',
                uri: base_url + '/auth',
                headers: {
                    'Authorization': 'Bearer ' + jtoken
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 200);
                assert.equal(body, 'OK Auth Token');
                done();
            });
        });

        it("returns status code 401 and 'Invalid Auth Token' with invalid Bearer JWT", function(done){
            request({
                method: 'POST',
                uri: base_url + '/auth',
                headers: {
                    'Authorization': 'Bearer ' + 'notvalidtoken'
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 401);
                assert.equal(body, 'Invalid Auth Token');
                done();
            });
        })
    })

});
