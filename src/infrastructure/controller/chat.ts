import { NextFunction, Request, Response } from 'express';
import ChatUseCases from '../../application/chatUseCase';

export default class ChatController {
  constructor(private chatUseCases: ChatUseCases) {}

  getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.passport!.user;
      const chats = await this.chatUseCases.getChats(userId);
      return res.status(200).json(chats);
    } catch (error) {
      next(error);
    }
  };

  postNewChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { members }: { members: string[] } = req.body;
      const authorId = req.session.passport!.user;
      members.push(authorId);
      const chat = await this.chatUseCases.createChat(members);
      return res.status(201).json(chat);
    } catch (error) {
      next(error);
    }
  };

  deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.session.passport!.user;
      const cid = req.body.cid;
      const chat = await this.chatUseCases.deleteChat(cid, uid);
      return res.status(200).send(chat);
    } catch (error) {
      next(error);
    }
  };

  postNewGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userId = req.session.passport!.user;
      let chatData: {
        alias: string;
        chatImage: string;
        admins: string[];
        members: string[];
      } = req.body;
      chatData = {
        ...chatData,
        admins: Array.isArray(chatData.admins)
          ? chatData.admins
          : [chatData.admins],
        members: Array.isArray(chatData.members)
          ? chatData.members
          : [chatData.members],
      };

      chatData.chatImage = req.file?.path || 'uploads/images/default.jpg';
      // chatData.members.push(userId); // NOTE: can be done in the client side
      // chatData.admins.push(userId);

      const chat = await this.chatUseCases.createGroup(chatData);
      return res.status(201).json(chat);
    } catch (error) {
      next(error);
    }
  };

  // addMembersToGroup = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const chatData = req.body;
  //     chatData.adminId = req.session.passport!.user;
  //     const chat = await this.chatUseCases.addMembersToGroup(chatData);
  //     return res.status(200).json(chat);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // removeMembersFromGroup = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const chatData = req.body;
  //     chatData.adminId = req.session.passport!.user;
  //     const chat = await this.chatUseCases.removeMembersFromGroup(chatData);
  //     return res.status(200).json(chat);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatData = req.body;
      if (req.file) chatData.chatImage = req.file.path;
      const adminId = req.session.passport!.user;

      const chat = await this.chatUseCases.updateGroup(chatData, adminId);
      return res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  };

  deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatData = req.body;
      chatData.adminId = req.session.passport!.user;
      const chat = await this.chatUseCases.deleteGroup(chatData);
      return res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  };

  // exitGroup = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const chatData = req.body;
  //     chatData.userId = req.session.passport!.user;
  //     const chat = await this.chatUseCases.exitGroup(chatData);
  //     return res.status(200).json(chat);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
