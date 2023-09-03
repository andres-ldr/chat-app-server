import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../Utils/httpCodes';
import UserUsesCases from '../../2.ABR/userUseCase';
import BaseError from '../../Utils/BaseError';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {}

  postNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body;
      newUser.profileImage =
        req.file?.path === undefined ? null : req.file?.path;
      const { name, lastName, email, profileImage } =
        await this.userUseCase.addNewUser(newUser);
      return res.status(201).json({ name, lastName, email, profileImage });
    } catch (err) {
      return next(err);
    }
  };

  fetchChats = async (req: Request, res: Response, next: NextFunction) => {
    let chats: {}[];
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
    let contacts;

    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }
      contacts = await this.userUseCase.getAllContacts(uid);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(contacts);
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

  fetchChatByMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { alias, members, adminId, chatImage } = req.body;
    let chatObj;

    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }

      chatObj = await this.userUseCase.getChatByMembers(
        alias,
        members,
        uid,
        adminId,
        chatImage
      );
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(chatObj);
  };

  getChatById = async (req: Request, res: Response, next: NextFunction) => {
    const { cid } = req.body;
    let chatAndID;

    try {
      const uid = req.session.passport?.user;

      if (!uid) {
        throw new BaseError('No author id', HttpStatusCode.BAD_REQUEST);
      }
      chatAndID = await this.userUseCase.getChatById(uid, cid);
    } catch (err) {
      return next(err);
    }
    return res.status(201).json(chatAndID);
  };

  postNewMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { cid, content, type } = req.body;
    let msg;
    try {
      const senderId = req.session.passport?.user;

      if (!senderId) {
        throw new BaseError('No sender id', HttpStatusCode.BAD_REQUEST);
      }
      msg = await this.userUseCase.sendMsg(cid, content, type, senderId);
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
      msgs = await this.userUseCase.getChatById(uid, chatId);
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
