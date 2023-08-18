import { Request, Response, NextFunction } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import { Chat } from '@prisma/client';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';
import session from 'express-session';
import passport from 'passport';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {}

  postNewUser = async (req: Request, res: Response, next: NextFunction) => {
    let userAuthLimited;

    try {
      const { name, email, profileImage } = await this.userUseCase.addNewUser(
        req.body
      );
      userAuthLimited = { name, email, profileImage };
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(userAuthLimited);
  };

  fetchChats = async (req: Request, res: Response, next: NextFunction) => {
    let chats: Chat[] | [];
    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No user id', HttpStatusCode.BAD_REQUEST);
      }
      chats = await this.userUseCase.getAllChats(uid);
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(chats);
  };

  fetchAllContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let users;
    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }
      users = await this.userUseCase.getAllContacts(uid);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json({ users });
  };

  postNewContact = async (req: Request, res: Response, next: NextFunction) => {
    const { alias, email } = req.body;
    let authorId;
    let contactCreated;
    try {
      authorId = req.session.passport?.user;

      if (!authorId) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }
      contactCreated = await this.userUseCase.addNewContact(
        authorId,
        alias,
        email
      );
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(contactCreated);
  };

  postNewChat = async (req: Request, res: Response, next: NextFunction) => {
    const { alias, members } = req.body;
    let newChat;

    try {
      const creatorId = req.session.passport?.user;

      if (!creatorId) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }

      members.push({ uid: creatorId });
      newChat = await this.userUseCase.createNewChat(
        alias,
        members,
        res.locals.uid
      );
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(newChat);
  };

  postNewMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, content, type } = req.body;
    let msg;
    try {
      const senderId = req.session.passport?.user;

      if (!senderId) {
        throw new BaseError('No sender id', HttpStatusCode.BAD_REQUEST);
      }
      msg = await this.userUseCase.sendMsg(chatId, content, type, senderId);
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(msg);
  };

  fetchChatMsgs = async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.body;
    let msgs;
    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No user id', HttpStatusCode.BAD_REQUEST);
      }
      msgs = await this.userUseCase.getAllChatMsgs(uid, chatId);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(msgs);
  };

  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
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
  };
}
