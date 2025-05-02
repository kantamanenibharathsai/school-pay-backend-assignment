import express from 'express';
import cors from 'cors';
import { transactionRoutes } from './routes/transactionRoutes.js';
import { importRoutes } from './routes/importRoutes.js';
import { setupSwagger } from './swagger/swagger.js';
import { errorHandler } from './utils/errorHandler.js';

export const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

app.use('/api', transactionRoutes);
app.use('/api', importRoutes);

setupSwagger(app);

app.use(errorHandler);
