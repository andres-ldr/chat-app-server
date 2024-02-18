import { Router } from 'express';
import { usersRouter } from '../presentation/routes/users.router';

export const api: Router = Router();

api.use('/users', usersRouter);
