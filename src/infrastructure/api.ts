import { NextFunction, Request, Response, Router } from 'express';
import { usersRouter } from './routes/users';
import { contactRouter } from './routes/contacts';
import passport from 'passport';
import { chatRouter } from './routes/chats';
import BaseError from '../Utils/BaseError';
import { HttpStatusCode } from '../Utils/httpCodes';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prismaClient from './config/prisma-client';
import PostgresUserRepository from './repository/postgresUserRepository';
import initPassport from './config/passport-config';
import session from 'express-session';

export const api: Router = Router();

const prisma = prismaClient.getInstance();

initPassport(passport, PostgresUserRepository.getInstance(prisma));

const sessionOptions = {
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    maxAge: 3600000,
    sameSite:
      process.env.NODE_ENV === 'development'
        ? 'lax'
        : ('none' as 'lax' | 'none' | 'strict' | boolean | undefined),
  },
};

api.use(session(sessionOptions));
api.use(passport.initialize());
api.use(passport.session());

api.post(
  '/login',
  passport.authenticate('local'),
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(req.user);
  }
);
api.use('/users', usersRouter);
api.use(async (req: Request, res: Response, next: NextFunction) => {
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
api.use('/contacts', contactRouter);
api.use('/chats', chatRouter);
api.delete('/logout', (req, res, next) => {
  req.logout((err) => {
    try {
      if (err) throw new Error(err);
    } catch (error) {
      next(err);
    }
  });
  return res.status(200).json({ message: 'Successful log out' });
});
