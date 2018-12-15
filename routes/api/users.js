const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const UserController = require('../../controller/userController');

const JWTController = require('../../controller/jwtController');
const { VALIDATION_FAILED } = require('../../models/customErrors');

/**
 * This module is in charge of communicate with Advert database in mongodb
 * @module User_router
 */


/**
 * Method that signs in the user
 * <p>curl -d '{"username":"correo@example.com", "password":"12345678"}' -H "Content-Type: application/json" -i -X POST http://localhost:8080/api/user/login</p>
 * @name Login
 * @route {POST} /api/user/login
 * @bodyparam {String} Username Username of the user
 * @bodyparam {String} Password Password of the user
 */
router.post('/login', (req, res, next) => {
  const promise = UserController.login_user(req.body.username, String(req.body.password));
  promise.then((result) => {
    const token = JWTController.generateToken(result.username);
    res.setHeader('Authorization', token);
    res.json(result);
  }, (err) => {
    next(err);
  });
});

/**
 * Creates a new user
 * Method that signs in the user
 * <p>curl -d '{"name":"Alberto", "password":"12345678", "username":"correo@example.com"}'
 *    -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/create</p>
 * @name Create user
 * @route {POST} /api/user/create
 * @bodyparam {String} Username Username of the user
 * @bodyparam {String} Password Password of the user
 * @bodyparam {String} Name Name of the user
 */
router.post('/create', [
  check('username').isEmail().withMessage('Username must be an email'),
], (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(VALIDATION_FAILED(errors.array()[0].msg));
  }
  const promise = UserController.create_user(req.body.name, req.body.password, req.body.username);
  promise.then(() => {
    res.status(200).send({ message: 'ok' });
  }, (err) => { next(err); });
});

module.exports = router;
