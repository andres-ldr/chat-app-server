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
usersRouter.get('/:uid', userController.fetchUserById);
usersRouter.post('/:uid/new_contact', userController.postNewContact);
usersRouter.post('/:uid/new_chat', userController.postNewChat);
usersRouter.post('/:uid/send_msg', userController.postNewMsg);
usersRouter.get('/:uid/chat', userController.fetchChatMsgs);
