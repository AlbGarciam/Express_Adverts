"use strict";
const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const User = require('../models/users/user');
const CustomError = require('../models/customErrors');

module.exports.login_user = (username, password) => {
  console.log("[UserController][LoginUser] username: " + username + "\tpassword: " + password);
  return new Promise((resolve, reject) => {
    if ( !username || !password ) {
      reject(CustomError.BAD_REQUEST);
    }
    User.search_by_username(username, (err, user) => {
      if ( err ){
        reject(CustomError.NOT_FOUND);
      } else if ( user && user.password === password ) {
        resolve(user);
      } else {
        reject(CustomError.INVALID_CREDENTIALS);
      }
    });
  });
};

module.exports.create_user = (name, password, username) => {
  return new Promise((resolve, reject) => {
    let user = createUser(name, password, username)
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
  _user.password = sanitizeHTML(password);
  _user.username = sanitizeHTML(username);
  _user.cuid = Cuid();
  return _user;
}

function validateEntries(name, password, username) {
  return name && password && username && password.length >= 8;
}
