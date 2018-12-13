"use strict";

var mongoose = require('mongoose');
var config = require('../etc/config')

var connection = mongoose.connection;

connection.on('error', (err) => {
  console.error("Mongo connection failed \n message: " + err.message);
  process.exit(1); // Force finishing the server
});

connection.once('open', () => {
  console.info("Mongo connection successfully stablished.");
});

mongoose.connect("mongodb://" + config.mongoPath + ":" + config.mongoPort + "/" + config.mongoDB,
                    { useCreateIndex: true, useNewUrlParser: true });
