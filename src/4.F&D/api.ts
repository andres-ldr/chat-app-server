import { Router } from 'express';
import { usersRouter } from '../3.IA/routes/users.router';

export const api: Router = Router();

api.use('/users', usersRouter);
