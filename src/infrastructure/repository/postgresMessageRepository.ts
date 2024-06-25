import { PrismaClient } from '@prisma/client';
import MessageRepository from '../../domain/MessageRepository';
import { Message, MsgEntity } from '../../domain/Message';

export default class PostgresMessageRepository implements MessageRepository {
  static instance: PostgresMessageRepository;
  constructor(private readonly prisma: PrismaClient) {}

  async deleteMessage(mid: string): Promise<Message> {
    return await this.prisma.message.delete({
      where: {
        mid,
      },
    });
  }

  async editMessage(message: MsgEntity): Promise<Message> {
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
  }: MsgEntity): Promise<Message> {
    return await this.prisma.message.create({
      data: {
        chatId,
        content,
        type,
        senderId,
      },
    });
  }

  async getMessages(chatId: string): Promise<
  ReturnType<typeof this.prisma.message.findMany>
  > {
    return await this.prisma.message.findMany({
      where: {
        chatId,
      },
      include: {
        sender: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
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
