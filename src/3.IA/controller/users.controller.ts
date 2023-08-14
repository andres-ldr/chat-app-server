import { Request, Response, NextFunction } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import { userResponseType } from '../../1.EBR/Types';
import { Chat } from '@prisma/client';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {}
  // fetchUserById = async (
  //   { params }: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { uid } = params;
  //   let user;
  //   try {
  //     user = await this.userUseCase.findUserById(uid);
  //   } catch (err) {
  //     const error = new HttpError('Creating contact failed, try again', 500);
  //     return next(error);
  //   }
  //   return res.status(200).json(user);
  // };

  postLogIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { token } = req.cookies;

    try {
      if (token) {
        throw new BaseError('Already Authenticated', 400);
      }

      const { userAuthLimited, tokenGen } = await this.userUseCase.authUser(
        email,
        password
      );

      return res
        .cookie('token', tokenGen, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        })
        .status(200)
        .json(userAuthLimited);
    } catch (err) {
      return next(err);
    }
  };

  postNewUser = async (req: Request, res: Response, next: NextFunction) => {
    let userAuthLimited, tokenGen, result;
    try {
      result = await this.userUseCase.addNewUser(req.body);

      userAuthLimited = result.userAuthLimited;
      tokenGen = result.tokenGen;
    } catch (err) {
      return next(err);
    }
    return res
      .cookie('token', tokenGen, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })
      .status(201)
      .json(userAuthLimited);
  };

  fetchChats = async (req: Request, res: Response, next: NextFunction) => {
    const uid = res.locals.uid;
    let chats: Chat[] | [];
    try {
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
    const uid = res.locals.uid;
    let users;
    try {
      users = await this.userUseCase.getAllContacts(uid);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json({ users });
  };

  postNewContact = async (req: Request, res: Response, next: NextFunction) => {
    const { alias, email } = req.body;
    const authorId = res.locals.uid;
    let contactCreated;
    try {
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
      members.push({ uid: res.locals.uid });
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
    const senderId = res.locals.uid;
    let msg;
    try {
      msg = await this.userUseCase.sendMsg(chatId, content, type, senderId);
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(msg);
  };

  fetchChatMsgs = async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.body;
    const uid = res.locals.uid;
    let msgs;
    try {
      msgs = await this.userUseCase.getAllChatMsgs(uid, chatId);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(msgs);
  };

  postLogOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token');
    } catch (error) {
      throw new BaseError(`${error}`, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
    return res.status(200).json({ message: 'Deleted cookie' });
  };

  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        throw new BaseError('Authentication failed', 401);
      }
      const { uid } = this.userUseCase.checkAuth(token);
      res.locals.uid = uid;
      next();
    } catch (err) {
      let error = err as BaseError;

      throw new BaseError(`${error}`, error.code);
    }
  };
}
