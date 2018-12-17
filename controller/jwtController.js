const fs = require('fs');
const jwt = require('jsonwebtoken');
const { JWT_ERROR, INVALID_TOKEN, MISSING_TOKEN } = require('../models/customErrors');
const User = require('../models/users/user');
const CustomErrors = require('../models/customErrors');

const secretKey = fs.readFileSync('./etc/private.key');
const publicKey = fs.readFileSync('./etc/public.pem');
/**
 * This module is in charge of manage JSON web token
 * @module Controllers/JWTController
 */


/**
 *
 * *************************** IMPORTANT: ***************************************\n
 * * If this app is used for production purposes,                               *\n
 * * you need to replace the private key and public key with your own keys      *\n
 * ******************************************************************************
 *
 */


/**
 * Validates the payload of a JWT
 *
 * @param {Object} sessionData This session data should content a username
 * @returns {Promise} Promise which only is fullfilled when is successfull
 */
function validateToken(sessionData) {
  const { username } = sessionData;
  return new Promise((resolve, reject) => {
    if (!username) {
      reject(CustomErrors.INVALID_TOKEN);
    }
    User.search_by_username(username, (err, user) => {
      if (err || !user) {
        reject(CustomErrors.INVALID_TOKEN);
      }
      resolve(username);
    });
  });
}

/**
 * Decrypts the JWT
 *
 * @param {string} token data which will be decrypted
 * @returns {Promise} returns if exists the payload
 */
function decryptToken(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(MISSING_TOKEN);
    }
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err || !decoded) {
        reject(JWT_ERROR(err.message));
      }
      resolve(decoded.data);
    });
  });
}

/**
 * Validates the JWT
 *
 * @param {string} token JWT token which needs to be validated
 * @returns {Promise} Promise which returns the new token that should be used
 */
module.exports.isValidToken = token => new Promise((resolve, reject) => {
  decryptToken(token).then((result) => {
    validateToken(result).then((username) => { // only can be successfull when is valid
      resolve(this.generateToken(username));
    }, (err) => {
      reject(err);
    });
  }, (err) => {
    reject(err);
  });
});

/**
 * Generates the JWT from an username
 *
 * @param {string} username data which will be used to generate the token
 * @returns {string} JWT
 */
module.exports.generateToken = (username) => {
  const sessionData = {
    username,
  };
  const token = jwt.sign({
    data: sessionData,
  }, secretKey, {
    expiresIn: process.env.JWT_TTL,
    algorithm: process.env.JWT_ALGORITHM
  });
  return token;
};
