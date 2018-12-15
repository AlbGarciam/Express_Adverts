const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const i18n = require('i18n');
const CustomErrors = require('./models/customErrors');

const JWTController = new require('./controller/jwtController');
require('./database/dbConnection.js');
require('./models/users/user');
require('./models/adverts/advert');
const config = require('./etc/config');

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

function isSecured(requestedpath) {
  return !(requestedpath === '/api/user/create' || requestedpath === '/api/user/login');
}

function onRequestReceived(req, res, next) {
  if (isSecured(req.path)) {
    const token = req.header('Authorization');
    JWTController.isValidToken(token).then((newToken) => {
      res.setHeader('Authorization', newToken);
      next();
    }, (err) => {
      next(err);
    });
  } else {
    next();
  }
}

const app = express();
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  register: global,
});

app.use(i18n.init);

// Configure port
app.listen(config.port, () => {
  console.info(`Server is running at: ${config.port}`);
});

// Configure logger
// Log files will be write at ./log/access.log and it will rotate each day
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log'),
});
app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// This will intercept all requests
// app.all('*', checkToken);
app.all('*', onRequestReceived);

app.use('/api/user', require('./routes/api/users'));
app.use('/api/adverts', require('./routes/api/adverts'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(CustomErrors.NOT_FOUND);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  if (isAPI(req)) {
    const language = req.header('Accept-Language');
    if (language) {
      req.setLocale('es');
    }
    const response = {
      status: err.code || 500,
    };
    response.msg = __(err.message);
    if (err.reason) {
      response.reason = __(err.reason);
    }
    res.json(response);
  }
});

module.exports = app;
