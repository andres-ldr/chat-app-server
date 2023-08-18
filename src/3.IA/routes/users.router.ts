import { Router } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import UserController from '../controller/users.controller';
import PostgresRepository from '../../4.F&D/repository/postgresRepository';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';
import initPassport from '../../4.F&D/passport-config';

export const usersRouter = Router();

const postgresRepository = new PostgresRepository();

const userUseCases = new UserUsesCases(postgresRepository);

const userController = new UserController(userUseCases);

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
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    },
  })
);
usersRouter.use(passport.initialize());
usersRouter.use(passport.session());

usersRouter.post('/new_user', userController.postNewUser);
usersRouter.post(
  '/login',
  passport.authenticate('local', {
    successMessage: true,
    failureMessage: true,
  }),
  (req, res, next) => {
    //req.session.messages
    res.status(200).json({ message: 'Login succesful' });
  }
);
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
usersRouter.use(userController.checkAuth);
usersRouter.post('/new_contact', userController.postNewContact);
usersRouter.post('/new_chat', userController.postNewChat);
usersRouter.get('/chats', userController.fetchChats);
usersRouter.get('/contacts', userController.fetchAllContacts);
usersRouter.post('/send_msg', userController.postNewMsg);
usersRouter.get('/chat', userController.fetchChatMsgs);
