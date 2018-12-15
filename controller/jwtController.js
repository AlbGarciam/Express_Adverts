"use strict";
const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../etc/config').jwt;
const { JWT_ERROR, INVALID_TOKEN } = require('../models/customErrors');
const User = require('../models/users/user');
const CustomErrors = require('../models/customErrors');

/**
 * 
 * *************************** IMPORTANT: ***************************************
 * * If this app is used for production purposes,                               *
 * * you need to replace the private key and public key with your own keys      *
 * ******************************************************************************
 * 
 */
const _secret = fs.readFileSync('./etc/private.key');
const _public = fs.readFileSync('./etc/public.pem');

/**
 * Validates the JWT
 * 
 * @param {string} token JWT token which needs to be validated
 * @returns {Promise} Promise which returns the new token that should be used
 */
module.exports.is_valid_token = (token) => {
    return new Promise((resolve, reject) => {
        decrypt_token(token).then( (result) => {
            validate_token(result).then((username) => { // only can be successfull when is valid
                resolve(this.generate_token(username));
            }, (err) => {
                reject(err);
            });
        }, (err) => {
            reject(err);
        });
    });
    
};

/**
 * Generates the JWT from an username
 * 
 * @param {string} username data which will be used to generate the token
 * @returns {string} JWT
 */
module.exports.generate_token = (username) => {
    var sessionData = {
        username: username
    };
    var token = jwt.sign({
        data: sessionData
    }, _secret, config.signOptions)
    return token;
};

/**
 * Validates the payload of a JWT
 * 
 * @param {Object} sessionData This session data should content a username
 * @returns {Promise} Promise which only is fullfilled when is successfull
 */
function validate_token(sessionData) {
    var username = sessionData.username;
    return new Promise( (resolve, reject) => {
        if ( !username ){
            reject(CustomErrors.INVALID_TOKEN);
        }
        User.search_by_username(username, (err, user) => {
            if ( err || !user ){
                reject( CustomErrors.INVALID_TOKEN );
            }
            resolve(username);
        });
    });
};

/**
 * Decrypts the JWT
 * 
 * @param {string} token data which will be decrypted
 * @returns {Promise} returns if exists the payload
 */
function decrypt_token(token) {
    return new Promise( (resolve, reject) => {
        if (!token) {
            reject(INVALID_TOKEN);
        }
        jwt.verify(token, _public, (err, decoded) => {
            if (err || !decoded) {
                reject(JWT_ERROR(err.message));
            }
            resolve(decoded.data);
        });
    });
};
