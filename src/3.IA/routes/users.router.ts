import { Router } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import UserController from '../controller/users.controller';
import PostgresRepository from '../../4.F&D/repository/postgresRepository';
import JwtRepository from '../../4.F&D/repository/JWTRepository';

export const usersRouter = Router();

const postgresRepository = new PostgresRepository();
const jwtRepository = new JwtRepository(`${process.env.JWT_KEY}`, '1h');

const userUseCases = new UserUsesCases(postgresRepository, jwtRepository);

const userController = new UserController(userUseCases);

usersRouter.post('/', userController.postNewUser);
usersRouter.post('/login', userController.postLogIn);
usersRouter.use(userController.checkAuth);
usersRouter.post('/logout', userController.postLogOut);
usersRouter.get('/chats', userController.fetchChats);
usersRouter.get('/contacts', userController.fetchAllContacts);
// usersRouter.get('/:uid', userController.fetchUserById);
usersRouter.post('/new_contact', userController.postNewContact);
usersRouter.post('/new_chat', userController.postNewChat);
usersRouter.post('/send_msg', userController.postNewMsg);
usersRouter.get('/chat', userController.fetchChatMsgs);
