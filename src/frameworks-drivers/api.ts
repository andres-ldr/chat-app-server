import { Router } from 'express';
import { usersRouter } from '../interface-adapters/routes/users.router';

export const api: Router = Router();

api.use('/users', usersRouter);
