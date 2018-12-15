var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./etc/config')
var rfs = require('rotating-file-stream');
require('./database/dbConnection.js');
require('./models/users/user');
require('./models/adverts/advert')
var JWTController = new require('./controller/jwtController');
var CustomErrors = require('./models/customErrors');

var app = express();
var i18n = require("i18n");

i18n.configure({
  locales:['en', 'es'],
  directory: __dirname + '/locales',
  register: global
});

app.use(i18n.init);

//Configure port
app.listen(config.port, () => {
  console.info("Server is running at: " + config.port);
});

// Configure logger
// Log files will be write at ./log/access.log and it will rotate each day
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});
app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// This will intercept all requests
//app.all('*', checkToken);
app.all('*', on_request_received);

app.use("/api/user", require('./routes/api/users'));
app.use("/api/adverts", require('./routes/api/adverts'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(CustomErrors.NOT_FOUND);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (isAPI(req)) {
    var language = req.header("Accept-Language");
    if ( language ) {
      req.setLocale("es")
    }
    var response = {
      status: err.code || 500
    };
    response.msg = __(err.message);
    if (err.reason) {
      response.reason = err.reason
    }
    res.json(response);
  }
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

function on_request_received(req, res, next) {
  if (is_secured(req.path)) {
    var token = req.header("Authorization");
    JWTController.is_valid_token(token).then((newToken) => {
      res.setHeader("Authorization", token);
      next();
    }, (err) => {
      next(err);
    });
  } else {
    next();
  }
};

function is_secured(path) {
  return !( path === "/api/user/create" || path === "/api/user/login" )
};

module.exports = app;
