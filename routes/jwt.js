"use strict";
const JWTController = require('../controller/jwtController');
const { INVALID_TOKEN } = require('../models/customErrors');
/**
 * This module provides a middleware to validate the authorization header
 * @module Routers/JWT
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
  