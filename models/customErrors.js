"use strict";

function CustomError(errCode, msg, reason) {
  this.code = errCode;
  this.message = msg;
  if (reason)
    this.reason = reason;
}

// Generic
module.exports.WRONG_PARAMS = new CustomError(400, "Wrong params");
module.exports.BAD_REQUEST = new CustomError(400, "Bad request");
module.exports.UNAUTHORIZED = new CustomError(401, "Unauthorized");
module.exports.NOT_FOUND = new CustomError(404, "Not found");

// Create errors
module.exports.USER_EXISTS = new CustomError(400, "User already exists");

// Login errors
module.exports.INVALID_CREDENTIALS = new CustomError(403, "Invalid credentials");

// Validation errors 
module.exports.VALIDATION_FAILED = (customMessage) => {
  return new CustomError(400, "Wrong params", customMessage)
}

// JWT errors
module.exports.JWT_ERROR = (customMessage) => {
  return new CustomError(403, "JWT error", customMessage)
};

module.exports.INVALID_TOKEN = new CustomError(403, "Invalid token");
