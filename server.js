/*
https://github.com/relloller/async-emission
*/
'use strict';

var jwt = require('jwt-simple');
var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var db = require("./api/model/db");
var api = require("./api/index.js");


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api",api);
var port= process.env.PORT || 8080;
app.listen(port, process.env.IP || "0.0.0.0", function() {
    console.log("async-emission server listening", port);
});


