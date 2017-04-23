
var express = require('express');
var router = express.Router();
var UsersCtrl = require('./users/users.controller.js');
var AuthCtrl = require('./auth/auth.controller.js');
router.get('/', function (req,res) {
	return res.status(200).send("async-emission Demo API");
})
router.post('/login', UsersCtrl.login);
router.post('/register', UsersCtrl.register);
router.post('/auth', AuthCtrl.verify);
module.exports = router;