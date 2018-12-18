const fs = require('fs');
const jwt = require('jsonwebtoken');
const { JWT_ERROR, INVALID_TOKEN, MISSING_TOKEN } = require('../models/customErrors');
const User = require('../models/users/user');
const crypto = require("crypto");

const secretKey = fs.readFileSync('./etc/private.key');
const publicKey = fs.readFileSync('./etc/public.pem');

function sha256(data) {
    return crypto.createHash("sha256").update(data, "binary").digest("base64");
}

/**
 * This module is in charge of manage JSON web token
 * @module Controllers/JWTController
 */

/**
 * Decrypts the JWT
 * 
 * <p>*************************** IMPORTANT: **************************************<br>
 * * If this app is used for production purposes,                               *<br>
 * * you need to replace the private key and public key with your own keys      *<br>
 * ******************************************************************************</p>
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
module.exports.isValidToken = async (token) => {
  var sessionData = await decryptToken(token);
  if (sessionData.username && sessionData.token) {
    return sha256(sessionData.username) === sessionData.token
  }
  return false;
}

/**
 * Generates the JWT from an username
 * 
 * <p>*************************** IMPORTANT: **************************************<br>
 * * If this app is used for production purposes,                               *<br>
 * * you need to replace the private key and public key with your own keys      *<br>
 * ******************************************************************************</p>
 * 
 * @param {string} username data which will be used to generate the token
 * @returns {string} JWT
 */
module.exports.generateToken = (username) => {
  const sessionData = { 
    username: username,
    token: sha256(username)
  };
  const token = jwt.sign({
    data: sessionData,
  }, secretKey, {
    expiresIn: process.env.JWT_TTL,
    algorithm: process.env.JWT_ALGORITHM
  });
  return token;
};
