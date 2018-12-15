

const mongoose = require('mongoose');
const config = require('../etc/config');

mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection failed \n message: ${err.message}`);
  process.exit(1); // Force finishing the server
});

mongoose.connection.once('open', () => {
  console.info('Mongo connection successfully stablished.');
});

mongoose.connect(`mongodb://${config.mongoPath}:${config.mongoPort}/${config.mongoDB}`,
  { useCreateIndex: true, useNewUrlParser: true });
