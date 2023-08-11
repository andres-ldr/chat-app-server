import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { api } from './api';
import helmet from 'helmet';
import ErrorHandler from './middleware/ErrorHandler';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(json());

app.use('/v1', api);

app.use(ErrorHandler);
