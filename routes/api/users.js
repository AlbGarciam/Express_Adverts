const express = require('express');
const router = express.Router();
const UserController = require('../../controller/userController');
const JWTController = new require('../../controller/jwtController');
const { check, validationResult } = require('express-validator/check')
const {VALIDATION_FAILED} = require('../../models/customErrors');

/* GET users listing.
 * curl -d '{"username":"correo@example.com", "password":"12345678"}' -H "Content-Type: application/json" -i -X POST http://localhost:8080/api/user/login
*/
router.post('/login', (req, res, next) => {
  var promise = UserController.login_user(req.body.username, String(req.body.password));
  promise.then((result) => {
    var token = JWTController.generate_token({username: result.username});
    console.log("token generated: "+token);
    res.setHeader("Authorization", token);
    res.json(result);
  }, (err) => {
    next(err);
  });
});

/**
 * Creates a new user
 * curl -d '{"name":"Alberto", "password":"12345678", "username":"correo@example.com"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/create
 */
router.post('/create', [
  check('username').isEmail().withMessage("Username must be an email")
], (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(VALIDATION_FAILED(errors.array()[0].msg ))
  }
  
  const body = req.body;
  var promise = UserController.create_user(body.name, body.password, body.username);
  promise.then((result) => {
    res.status(200).send('ok');
  }, (err) => {
    next(err);
  });
});

module.exports = router;
