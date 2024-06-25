import prismaClient from '../infrastructure/config/prisma-client';
import { Message, MsgEntity } from './Message';

const prisma = prismaClient.getInstance();

export default interface MessageRepository {
  postMessage(
    message: MsgEntity
  ): Promise<ReturnType<typeof prisma.message.create>>;
  getMessages(
    chatId: string
  ): Promise<ReturnType<typeof prisma.message.findMany>>;
  editMessage(message: MsgEntity): Promise<Message>;
  deleteMessage(mid: string): Promise<Message>;
}
