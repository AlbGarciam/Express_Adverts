

const mongoose = require('mongoose');

mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection failed \n message: ${err.message}`);
  process.exit(1); // Force finishing the server
});

mongoose.connection.once('open', () => {
  console.info('Mongo connection successfully stablished.');
});

mongoose.connect(`mongodb://${process.env.MONGO_PATH}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
  { useCreateIndex: true, useNewUrlParser: true });
