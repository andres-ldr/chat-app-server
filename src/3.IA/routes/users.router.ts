import PostgresRepository from '../../4.F&D/repository/postgresRepository';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { Request, Response, NextFunction, Router } from 'express';
import fileUploader from '../../4.F&D/middleware/fileUploader';
import initPassport from '../../4.F&D/config/passport-config';
import UserController from '../controller/users.controller';
import UserUsesCases from '../../2.ABR/userUseCase';
import session from 'express-session';
import passport from 'passport';

export const usersRouter = Router();

const postgresRepository = new PostgresRepository();

const userUseCases = new UserUsesCases(postgresRepository);

const userController = new UserController(userUseCases);

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
      secure: false, //process.env.NODE_ENV === 'production',
      httpOnly: false,
      maxAge: 3600000,
      sameSite: 'lax', // revisar
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
//usersRouter.post('/chat', userController.fetchChatMsgs);
