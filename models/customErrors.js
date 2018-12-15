

function CustomError(errCode, msg, reason) {
  this.code = errCode;
  this.message = msg;
  if (reason) this.reason = reason;
}

// Generic
module.exports.WRONG_PARAMS = new CustomError(400, 'WRONG_PARAMS');
module.exports.BAD_REQUEST = new CustomError(400, 'BAD_REQUEST');
module.exports.UNAUTHORIZED = new CustomError(401, 'UNAUTHORIZED');
module.exports.NOT_FOUND = new CustomError(404, 'NOT_FOUND');

// Create errors
module.exports.USER_EXISTS = new CustomError(400, 'USER_EXISTS');

// Login errors
module.exports.INVALID_CREDENTIALS = new CustomError(403, 'INVALID_CREDENTIALS');

// Validation errors
module.exports.VALIDATION_FAILED = customMessage => new CustomError(400, 'WRONG_PARAMS', customMessage);

// JWT errors
module.exports.JWT_ERROR = customMessage => new CustomError(403, 'JWT_ERROR', customMessage);
module.exports.INVALID_TOKEN = new CustomError(403, 'INVALID_TOKEN');
