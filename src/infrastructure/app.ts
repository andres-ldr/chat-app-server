import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { api } from './api';
import ErrorHandler from './middleware/ErrorHandler';
import morgan from 'morgan';

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(json()); //limit: '50mb'

// test config for express-session
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://gregarious-beijinho-ae0ab4.netlify.app',
    credentials: true,
  })
);

app.enable('trust proxy');
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/v1', api);

app.use(ErrorHandler);
