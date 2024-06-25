import { PrismaClient } from '@prisma/client';
import MessageRepository from '../../domain/MessageRepository';
import { MsgEntity } from '../../domain/Message';

export default class PostgresMessageRepository implements MessageRepository {
  static instance: PostgresMessageRepository;
  constructor(private readonly prisma: PrismaClient) {}

  async deleteMessage(mid: string): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }> {
    return await this.prisma.message.delete({
      where: {
        mid,
      },
    });
  }

  async editMessage(message: MsgEntity): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }> {
    return await this.prisma.message.update({
      where: {
        mid: message.mid,
      },
      data: {
        content: message.content,
      },
    });
  }

  async postMessage({ chatId, content, type, senderId }: MsgEntity): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }> {
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
    ({
      sender: {
        uid: string;
        name: string;
        lastName: string;
        email: string;
        profileImage: string | null;
      };
    } & {
      mid: string;
      chatId: string;
      content: string | null;
      file: string | null;
      type: string;
      creationDate: Date;
      senderId: string;
    })[]
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
