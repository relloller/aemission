"use strict";

const Users = require("./users.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecretKey = "meowmeow"; //should be RS256 in production
const aemission = require("../../aemission.js");

function register(req, res) {
    const { email, password: pw } = req.body;

    aemission.next({ email, pw },
        [
            verifyParams,
            emailAvailable,
            hashPW,
            createUser,
            encodeJWT,
            function(cbID, { token }) {
                res.status(200).json({ token });
                console.log('jsontoken');
                return cbID(null, {});
            }
        ],
        function errCB(eData) { 
            const { logMsg, msg, statusCode } = eData;
            if (msg && statusCode) return res.status(statusCode).json({ statusCode, msg });
            else return res.status(500).end();
        }
    );

}

function verifyParams(cbID, { email, pw }) {
    if (!email || !pw || (email === "" || pw === ""))
        return cbID(new Error("ParamsBlank"), {
            statusCode: 406,
            msg: "Email/password cannot be empty"
        });
    else return cbID(null, { email, pw });
}

function emailAvailable(cbID, { email }) {
    Users.findOne(
        { email },
        (err, data) => {
            if (err) return cbID(err, { statusCode: 500, logMsg: "emailAvailable" });
            else if (data === null) return cbID(null, true);
            else return cbID(new Error("Email exists"), {
                statusCode: 409,
                msg: "Email exists"
            });
        }
    );
}

function hashPW(cbID, { pw }) {
    bcrypt.hash(pw, 11, (err, pwHash) => {
        if (err) return cbID(err, { statusCode: 500, logMsg: "hashPW" });
        else return cbID(null, { pwHash });
    });
}

function createUser(cbID, { email, pwHash }) {
    Users.create({ email, pwHash }, (err, result) => {
        if (err) return cbID(err, { statusCode: 500, logMsg: "createUser" });
        else return cbID(null, result);
    });
}

function encodeJWT(cbID, { _id }) {
    jwt.sign({ _id },
        jwtSecretKey, { algorithm: "HS256", expiresIn: "12h" },
        (err, token) => {
            if (err) return cbID(err, { statusCode: 500, logMsg: "encodeJWT" });
            else return cbID(null, { token });
        }
    );
}

module.exports = {
    register
};
