require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const i18n = require('i18n');
const CustomErrors = require('./models/customErrors');

require('./database/dbConnection.js');
require('./models/users/user');
require('./models/adverts/advert');

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

const app = express();
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  register: global,
});

app.use(i18n.init);

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

app.use('/api/user', require('./routes/api/users'));
app.use('/api/adverts', require('./routes/api/adverts'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const response = {
    status: CustomErrors.NOT_FOUND.code,
  };
  response.msg = __(CustomErrors.NOT_FOUND.message);
  res.status(CustomErrors.NOT_FOUND.code).json(response);
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
