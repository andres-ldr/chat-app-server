import { Router } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import UserController from '../controller/users.controller';
import MockUserRespository from '../../4.F&D/repository/mockRepository';

export const usersRouter = Router();

const mockUserRepository = new MockUserRespository();

const userUseCases = new UserUsesCases(mockUserRepository);

const userController = new UserController(userUseCases);

usersRouter.post('/', userController.postNewUser);
usersRouter.get('/', userController.fetchAllUsers);
