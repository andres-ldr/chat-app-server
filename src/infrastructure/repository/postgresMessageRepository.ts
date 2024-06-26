import { PrismaClient } from '@prisma/client';
import MessageRepository from '../../domain/MessageRepository';
import { MsgEntity } from '../../domain/Message';

export default class PostgresMessageRepository implements MessageRepository {
  static instance: PostgresMessageRepository;
  constructor(private readonly prisma: PrismaClient) {}

  async deleteMessage(mid: string): Promise<any> {
    return await this.prisma.message.delete({
      where: {
        mid,
      },
    });
  }

  async editMessage(message: MsgEntity): Promise<any> {
    return await this.prisma.message.update({
      where: {
        mid: message.mid,
      },
      data: {
        content: message.content,
      },
    });
  }

  async postMessage({
    chatId,
    content,
    type,
    senderId,
  }: MsgEntity): Promise<any> {
    return await this.prisma.message.create({
      data: {
        chatId,
        content,
        type,
        senderId,
      },
    });
  }

  async getMessages(chatId: string): Promise<any[]> {
    return await this.prisma.message.findMany({
      where: {
        chatId,
      },
    });
  }

  static getInstance(prisma: PrismaClient): PostgresMessageRepository {
    if (!PostgresMessageRepository.instance) {
      PostgresMessageRepository.instance = new PostgresMessageRepository(
        prisma
      );
    }
    return PostgresMessageRepository.instance;
  }
}
