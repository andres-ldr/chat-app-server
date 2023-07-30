import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { api } from './api';

export const app = express();

app.use(cors());
app.use(json());

app.use('/v1', api);
