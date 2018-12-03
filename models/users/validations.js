"use strict";

module.exports.validatePassword = (password) => {
  if ( password ) {
    return password.length >= 8;
  }
  return false
};
