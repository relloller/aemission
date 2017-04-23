'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/async-emission');

mongoose.connection.on('connected', function() {
    console.log('connected async-emission db');
});

process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		console.log('disconnected async-emission db');
		process.exit(0);
	});
});
