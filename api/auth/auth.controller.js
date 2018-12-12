'use strict';

var jwt = require('jsonwebtoken');
var jwtSecret = "meowmeow";

function verifyJWT(req, res, next) {
    var {bearerToken} = req.headers.authorization;
    const token = bearerToken.substring(7);
    if (!token) return res.status(401).send('Access Denied');
    jwt.verify(token, jwtSecret, { algorithms: 'HS256' }, function(err, p) {
        if (err) {
            console.error(err);
            if(err.message.startsWith('Unexpected Token') || err.message.includes('malformed') || err.message.includes('invalid')) return res.status(401).send('Invalid Auth Token');
            return res.status(500).send('System Error');
        }
        return res.status(200).send('OK Auth Token');
    });
}

module.exports={
    verify:verifyJWT
}
