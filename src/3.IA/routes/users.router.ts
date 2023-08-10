import { Router } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import UserController from '../controller/users.controller';
import PostgresRepository from '../../4.F&D/repository/postgresRepository';

export const usersRouter = Router();

const postgresRepository = new PostgresRepository();

const userUseCases = new UserUsesCases(postgresRepository);

const userController = new UserController(userUseCases);

usersRouter.post('/', userController.postNewUser);
usersRouter.get('/chats', userController.fetchChats);
usersRouter.get('/contacts', userController.fetchAllContacts);
// usersRouter.get('/:uid', userController.fetchUserById);
usersRouter.post('/new_contact', userController.postNewContact);
usersRouter.post('/new_chat', userController.postNewChat);
usersRouter.post('/send_msg', userController.postNewMsg);
usersRouter.get('/chat', userController.fetchChatMsgs);
