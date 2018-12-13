"use strict";
const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const User = require('../models/users/user');
const CustomError = require('../models/customErrors');
const Validations = require('../models/users/validations')

module.exports.login_user = (username, password) => {
  console.log("[UserController][LoginUser] username: " + username + "\tpassword: " + password);
  return new Promise((resolve, reject) => {
    if ( !username || !password ) {
      reject(CustomError.BAD_REQUEST);
    }
    User.search_by_username(username, (err, user) => {
      if ( err ){
        reject(CustomError.NOT_FOUND);
      } else if ( user && Validations.validate_password(user.salt, password, user.password)) {
        resolve({
          username: user.username,
          name: user.name,
          date: user.date,
          id: user.cuid
        });
      } else {
        reject(CustomError.INVALID_CREDENTIALS);
      }
    });
  });
};

module.exports.create_user = (name, password, username) => {
  return new Promise((resolve, reject) => {
    const user = createUser(name, password, username);
    var error = user.validateSync();
    if (error) {
      reject(CustomError.WRONG_PARAMS);
    } else {
      user.save((err, saved) => {
        if (err)
          reject( err.code === 11000 ? CustomError.USER_EXISTS : CustomError.BAD_REQUEST);
        resolve(saved);
      });
    }
  });
};

function createUser(name, password, username) {
  var _user = new User();
  _user.name = sanitizeHTML(name);
  _user.salt = Validations.generate_salt();
  _user.password = Validations.hash_password(password, _user.salt);
  _user.username = sanitizeHTML(username);
  _user.cuid = Cuid();
  return _user;
};
