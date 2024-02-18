import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { NextFunction, Request, Response, Router } from 'express';
import session from 'express-session';
import passport from 'passport';
import UserUsesCases from '../../application/userUseCase';
import initPassport from '../../infrastructure/config/passport-config';
import fileUploader from '../../infrastructure/middleware/fileUploader';
import PostgresRepository from '../../infrastructure/repository/postgresRepository';
import UserController from '../controller/users.controller';

export const usersRouter = Router();

const postgresRepository = new PostgresRepository();

export const userUseCases = new UserUsesCases(postgresRepository);

export const userController = new UserController(userUseCases);

//usersRouter.set('trust proxy', 1) // trust first proxy
initPassport(passport, postgresRepository);
usersRouter.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(postgresRepository.prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'development' ? false : true,
      httpOnly: true,
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    },
  })
);

usersRouter.use(passport.initialize());
usersRouter.use(passport.session());

usersRouter.post('/new_user', fileUploader, userController.postNewUser);
usersRouter.post(
  '/login',
  passport.authenticate('local'),
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(req.user);
  }
);

usersRouter.use(userController.checkAuth);
usersRouter.delete('/logout', (req, res, next) => {
  req.logout((err) => {
    try {
      if (err) throw new Error(err);
    } catch (error) {
      throw new Error(err);
    }
  });
  return res.status(200).json({ message: 'Successful log out' });
});
usersRouter.post('/new_contact', userController.postNewContact);
usersRouter.post('/chat_by_members', userController.fetchChatByMembers);
usersRouter.post('/chatById', userController.getChatById);
usersRouter.get('/chats', userController.fetchChats);
usersRouter.get('/contacts', userController.fetchAllContacts);
usersRouter.post('/send_msg', userController.postNewMsg);
