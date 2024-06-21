import UserUsesCases from '../../application/userUseCase';
import UserController from '../controller/users';
import fileUploader from '../middleware/fileUploader';
import PostgresUserRepository from '../repository/postgresUserRepository';
import prismaClient from '../config/prisma-client';
import { HttpStatusCode } from '../../Utils/httpCodes';
import BaseError from '../../Utils/BaseError';
import { NextFunction, Request, Response, Router } from 'express';

export const usersRouter = Router();

const prisma = prismaClient.getInstance();
const postgresUserRepository = PostgresUserRepository.getInstance(prisma);
const userUseCases = UserUsesCases.getInstance(postgresUserRepository);

const userController = new UserController(userUseCases);

usersRouter.post('/get', userController.getUsersByNameOrEmail);
usersRouter.post(
  '/new',
  fileUploader.single('profileImage'),
  userController.postNewUser
);
// auth required
usersRouter.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
  } catch (error) {
    throw new BaseError(
      'Authentication error',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
  return res.status(400).json({ message: 'Authentication failed' });
});

usersRouter.patch(
  '/update',
  fileUploader.single('profileImage'),
  userController.updateUser
);
usersRouter.delete(
  '/delete',
  (req, res, next) => {
    req.body.uid = req.session.passport!.user;
    req.logout((err) => {
      try {
        if (err) throw new Error(err);
      } catch (error) {
        throw next(err);
      }
    });
    next();
  },
  userController.deleteUser
);
