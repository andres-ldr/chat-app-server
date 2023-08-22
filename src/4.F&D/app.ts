import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { api } from './api';
import helmet from 'helmet';
import ErrorHandler from './middleware/ErrorHandler';

export const app = express();

app.use(helmet());
app.use(json({ limit: '200mb' }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/v1', api);

app.use(ErrorHandler);
