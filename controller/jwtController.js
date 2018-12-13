"use strict";
const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../etc/config').jwt;
const { JWT_ERROR, INVALID_TOKEN } = require('../models/customErrors');

const _secret = fs.readFileSync('./etc/private.key');
const _public = fs.readFileSync('./etc/public.pem');

module.exports.generate_token = (sessionData) => {
    var details = { sessionData: sessionData };
    let token = jwt.sign({
        data: sessionData
    }, _secret, config.signOptions)
    return token;
};

module.exports.decrypt_token = (token) => {
    return new Promise( (resolve, reject) => {
        console.log(token);
        if (!token) {
            reject(INVALID_TOKEN);
        }
        jwt.verify(token, _public, (err, decoded) => {
            if (err || !decoded) {
                reject(JWT_ERROR(err.message));
            }
            resolve(decoded);
        });
    });
};
