"use strict";
const JWTController = require('../controller/jwtController');
const { INVALID_TOKEN } = require('../models/customErrors');
/**
 * This module provides a middleware to validate the authorization header
 * @module Routers/JWT
 * @route {get | post | put | delete} /
 * @authentication This route uses JWT verification. If you don't have the JWT you need to sign in
 * with a valid user
 * @headerparam {String} Accept-Language Language of the response
 */
module.exports = () => {
    return async (req, res, next) => {
      // Retrieve token
      const token = req.header('Authorization');
      try {
        if (await JWTController.isValidToken(token)) 
            next();
        else
            next(INVALID_TOKEN);
      } catch (err) {
        next(err);
        return;
      }
  
    };
  };
  