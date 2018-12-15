

const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const User = require('../models/users/user');
const CustomError = require('../models/customErrors');
const Validations = require('../models/users/validations');

/**
 * This module is in charge of communicate with User database in mongodb
 * @module UserController
 */

/**
 * Creates a user model
 * @param {string} username username of the user
 * @param {string} password password of the user
 * @returns {Promise} With the user model if proceeds
 */
module.exports.login_user = (username, password) => new Promise((resolve, reject) => {
  if (!username || !password) {
    reject(CustomError.BAD_REQUEST);
  }
  User.search_by_username(username, (err, user) => {
    if (err) {
      reject(CustomError.NOT_FOUND);
    } else if (user && Validations.validate_password(user.salt, password, user.password)) {
      resolve({
        username: user.username,
        name: user.name,
        date: user.date,
        id: user.cuid,
      });
    } else {
      reject(CustomError.INVALID_CREDENTIALS);
    }
  });
});

/**
 * Creates a user model
 * @param {string} name
 * @param {string} password
 * @param {string} username
 * @returns {Object} User
 */
function createUser(name, password, username) {
  const user = new User();
  user.name = sanitizeHTML(name);
  user.salt = Validations.generate_salt();
  user.password = Validations.hash_password(password, user.salt);
  user.username = sanitizeHTML(username);
  user.cuid = Cuid();
  return user;
}

/**
 * Creates a user from a given name, password and username
 * @param {string} name
 * @param {string} password
 * @param {string} username
 * @returns {Promise}
 */
module.exports.create_user = (name, password, username) => new Promise((resolve, reject) => {
  const user = createUser(name, password, username);
  const error = user.validateSync();
  if (error) {
    reject(CustomError.WRONG_PARAMS);
  } else {
    user.save((err, saved) => {
      if (err) reject(err.code === 11000 ? CustomError.USER_EXISTS : CustomError.BAD_REQUEST);
      resolve(saved);
    });
  }
});
