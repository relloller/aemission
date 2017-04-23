'use strict';

var User = require('./users.model.js');
var uuid = require('node-uuid');
var emitterUser = new(require('events')).EventEmitter();
var jwt = require('jsonwebtoken');
var secretoflife = "yourmamaissofatshesatonabinarytreeandconvertedittoalinkedlistinO(1)time";
var bcrypt = require('bcrypt');
var async = require("../async-emission.js");

emitterUser.on('error', function(err) {
    console.log('error emit', err);
});

function registerUser(req, res) {
    async.next([
        checkParams(req, res),
        userAvailable(atobAuth(req.headers.authorization.substr(6)).username, res),
        emailAvailable(req.body.email, res),
        hashPW(atobAuth(req.headers.authorization.substr(6)).password, 11, res),
        saveUser(req, res),
        encodeJWT(secretoflife,res),
        respLogin(res)
    ]);
}


function login(req, res) {
    async.next([
        userExists(atobAuth(req.headers.authorization.substr(6)).username, res),
        checkPW(atobAuth(req.headers.authorization.substr(6)).password, res),
        encodeJWT(secretoflife,res),
        respLogin(res)
    ]);
}

function userExists(username, res) {
    return function(emitid) {
        User.findOne({
            username: username
        }, function(err, data) {
            if (err || data === null) {
                async.emit(emitid, false);
                return res.status(401).send('username/pw not valid');
            }
            async.emit(emitid, true, data);
        });
    }
}


function userAvailable(username, res) {
    return function(emitid) {
        User.findOne({
            username: username
        }, function(err, data) {
            if (err) {
                async.emit(emitid, false, err);
                return res.status(500).send('System Error');
            } else if (data === null) {
                async.emit(emitid, true);
            } else if (data.username) {
                // console.log('usernameAvailable no' );
                // async.emitter.removeAllListeners(emitid);
                async.emit(emitid, false);
                return res.status(409).send('username exists');
            }
        });
    }
}

function emailAvailable(email, res) {
    return function(emitid) {
        User.findOne({
            email: email
        }, function(err, data) {
            if (err) {
                async.emit(emitid, false, err);
                return res.status(500).send('System Error');
            } else if (data === null) {
                async.emit(emitid, true);
            } else if (data.email) {
                async.emit(emitid, false);
                return res.status(409).send('email exists');
            }
        });
    }
}


function checkPW(password, res) {
    return function(emitid, userD) {
        bcrypt.compare(password, userD.pwHash, function(err, result) {
            // res == true
            if (err || !result) {
                async.emit(emitid, false);
                return res.status(401).send('username/pw not valid');
            }
            async.emit(emitid, result, userD);
        });
    }
}

function verifyJWT(token,res) {
    return function(emitid, userD) {
            var options = {algorithms: ['HS256']};
        jwt.verify(token, secretoflife, options, function(err, asyncToken) {
            if (err) return res.status(500).send('System Error');
            async.emit(emitid,true,{token:asyncToken, username:userD.username});
        });
    }
}

function encodeJWT(secretoflife,res) {
    return function(emitid, userD) {
        jwt.sign({ username: userD.username}, secretoflife, { algorithm: 'HS256',expiresIn: '12h' }, function(err, asyncToken) {
            if (err) return res.status(500).send('System Error');
            async.emit(emitid,true,{token:asyncToken, username:userD.username});
        });
    }
}
function encodeJWT(secretoflife,res) {
    return function(emitid, userD) {
        jwt.sign({ username: userD.username}, secretoflife, { algorithm: 'HS256' }, function(err, asyncToken) {
            if (err) return res.status(500).send('System Error');
            async.emit(emitid,true,{token:asyncToken, username:userD.username});
        });
    }
}


function respLogin(res) {
    return function(emitid, tokenData) {
        async.emit(emitid, true);
        return res.status(200).json(tokenData);
    }
}


function checkParams(req, res) {
    return function(emitid) {
        setImmediate(function() {
            let userPW = atobAuth(req.headers.authorization.substr(6));
            req.body.username = userPW.username;
            req.body.password = userPW.password;
            if (!req.body.email || !userPW.username || !userPW.password) {
                async.emit(emitid, false, { code: 400, msg: 'All fields required' });
                return res.status(400).send('All fields required');
            }
            userPW.email = req.body.email;
            async.emit(emitid, true, userPW);
        });
    }
}

function hashPW(password, salt, res) {
    return function(emitid) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                async.emit(emitid, false, err);
                return res.status(500).json({ msg: "System Error" });
            }
            async.emit(emitid, true, hash);
        });
    }
}


function saveUser(req, res) {
    return function(emitid, hash) {
        User.create({ username: req.body.username, email: req.body.email, pwHash: hash }, function(err, data) {
            if (err) {
                async.emit(emitid, false, err);
                return handleError(res, err);
            }
            async.emit(emitid, true, data);
        });
    }
}



function atobAuth(str) {
    var userpw = new Buffer.from(str, 'base64').toString('binary');
    for (var i = 0; i < userpw.length; i++) {
        if (userpw.charAt(i) === ":") {
            return {
                username: userpw.substring(0, i),
                password: userpw.substring(i + 1)
            };
        }
    }
}


process.on('uncaughtException', function(err, data) {
    console.log('err', err, data);
    console.log('uncaughtException err', err);
});



function handleError(res, err) {
    console.log(err);
    return res.status(500).json({ msg: 'System Error' });
}


module.exports = {
    login: login,
    register: registerUser
}
