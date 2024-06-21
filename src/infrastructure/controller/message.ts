import { NextFunction, Request, Response } from 'express';
import MessageUseCase from '../../application/messageUseCase';

export default class MessagesController {
  constructor(private messageUseCases: MessageUseCase) {
    this.messageUseCases = messageUseCases;
  }
  postMessage = async (req: Request, res: Response, next: NextFunction) => {
    const message = req.body;
    try {
      await this.messageUseCases.sendMessage(message);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };
  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.query.chatId as string;
    try {
      const messages = await this.messageUseCases.getMessages(chatId);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };
}
