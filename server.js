import dotenv from 'dotenv';
dotenv.config({path : './config.env'});
import { connectDB } from './dbconfig/db.js';
import { app } from './app.js';

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

// const dotenv = require('dotenv');
// dotenv.config({path: './config.env'});

// const dbconfig = require('./dbconfig/db.js');

// const server = require('./app');

// const port = process.env.PORT_NUMBER || 3000;

// server.listen(port, () => {
//     console.log('Listening to requests on PORT: ' + port);
// });
