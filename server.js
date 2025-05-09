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

