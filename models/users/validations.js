"use strict";

const Crypto = require('crypto');

/***
 * This method validates if password matches with the hash
 * 
 * @param {string} salt salt of user
 * @param {string} password clear password
 * @param {string} hash hashed password
 * @returns {boolean} If password + salt matches with stored password
 */
module.exports.validate_password = (salt, password, hash) => {
  const hashed = this.hash_password(password, salt)
  return  hashed === hash;
};

/***
 * This method generates a recure salt
 * @returns {string} secured salt
 */
module.exports.generate_salt = () => {
  return Crypto.randomBytes(256).toString('hex');
};

/***
 * This method generates a secured hash from a password and a salt
 * @param {string} password password to be hashed
 * @param {string} salt secured random string
 * @returns {string} hashed password
 */
module.exports.hash_password = (password, salt) => {
  console.info("Salt => " + salt);
  var hash = Crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
};