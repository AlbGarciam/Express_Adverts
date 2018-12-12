const express = require('express');
const router = express.Router();
const UserController = require('../../controller/userController');

/* GET users listing.
 * curl -d '{"username":"correo@example.com", "password":"12345678"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/login
*/
router.post('/login', (req, res, next) => {
  var promise = UserController.login_user(req.body.username, String(req.body.password));
  promise.then((result) => {
    res.json(result);
  }, (err) => {
    next(err);
  });
});

/**
 * Creates a new user
 * curl -d '{"name":"Alberto", "password":"12345678", "username":"correo@example.com"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/create
 */
router.post('/create', (req, res, next) => {
  let body = req.body;
  var promise = UserController.create_user(body.name, body.password, body.username);
  promise.then((result) => {
    res.json(result);
  }, (err) => {
    next(err);
  });
});

module.exports = router;
