var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./etc/config')
var rfs    = require('rotating-file-stream');
require('./database/dbConnection.js');
require('./models/users/user.js');

var app = express();

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
app.use(logger('combined', { stream: accessLogStream } ));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// This will intercept all requests
app.all('*', checkUser);

app.use("/api/user", require('./routes/api/users'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (isAPI(req)){
    res.json({
      status: err.code || 500,
      msg: err.message,
      reason: err.reason
    });
  } else {
    res.render('error');
  }
});

function isAPI(req) {
  console.log(req.originalUrl);
  return req.originalUrl.indexOf('/api') === 0;
}

function checkUser(req, res, next) {
  if ( req.path === '/api/user/login' || req.path === '/api/user/create') {
    console.log("Allowing to access user");
    next();
    return;
  }
  console.log("Validating oauth");
  next();
}

module.exports = app;
