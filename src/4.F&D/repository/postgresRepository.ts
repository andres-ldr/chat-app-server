import { PrismaClient } from '@prisma/client';
import UserRepository from '../../2.ABR/user.repository';
import bcrypt from 'bcrypt';
import { UserEntity } from '../../1.EBR/user.entity';
import { userResponseType } from '../../1.EBR/Types';
import { ChatEntity } from '../../1.EBR/chat.entity';
import { MsgEntity } from '../../1.EBR/msg.entity';
require('dotenv').config();

export default class PostgresRepository implements UserRepository {
  prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async fetchAllChats(userId: string): Promise<ChatEntity[] | []> {
    let AllChats;
    try {
      AllChats = await this.prisma.chat.findMany({
        where: { members: { every: { uid: userId } } },
      });
    } catch (err) {
      throw new Error();
    }
    return AllChats;
  }

  async getUserById(uuid: string): Promise<UserEntity | null> {
    let result;
    try {
      //this.userClient.$connect();
      result = this.prisma.user.findUnique({ where: { uid: `${uuid}` } });
    } catch (err) {
      throw new Error();
    } finally {
      //this.userClient.$disconnect();
    }
    return result;
  }
  async postNewUser(user: UserEntity): Promise<userResponseType> {
    const { name, lastName, email, password, profileImage } = user;
    let result;
    try {
      const hash = await bcrypt.hash(password, 10);
      result = await this.prisma.user.create({
        data: { name, lastName, email, password: `${hash}`, profileImage },
      });
    } catch (err) {
      console.log(err);
      throw new Error();
    }
    return result;
  }
  async fetchAllContacts(uid: string): Promise<{}[]> {
    let result;
    try {
      result = await this.prisma.contact.findMany({ where: { authorId: uid } });
    } catch (err) {
      throw new Error();
    }
    return result;
  }
  async postNewContact(
    userId: string,
    alias: string,
    email: string
  ): Promise<{ email: string; authorId: string; alias: string } | null> {
    let contact;
    let result;
    try {
      contact = await this.prisma.user.findFirst({
        where: { email },
      });
      const user = await this.getUserById(userId);

      if (!contact) {
        throw new Error();
      }

      if (!user) {
        throw new Error();
      }

      const isContactInUser = await this.prisma.contact.count({
        where: {
          authorId: userId,
          email,
        },
      });

      if (isContactInUser) {
        throw new Error();
      }

      result = await this.prisma.contact.create({
        data: {
          alias,
          email,
          authorId: userId,
        },
      });
    } catch (err) {
      throw new Error();
    }
    return result;
  }
  async postNewChat(
    alias: string,
    participants: []
  ): Promise<ChatEntity | null> {
    let newChat;
    let ids: string[] = [];

    participants.forEach((obj: { uid: string }) => ids.push(obj.uid));

    try {
      const isChatExisting = await this.prisma.chat.count({
        where: {
          members: {
            every: {
              uid: {
                in: ids,
              },
            },
          },
        },
      });

      if (isChatExisting > 0) {
        throw new Error();
      }

      newChat = await this.prisma.chat.create({
        data: {
          alias,
          members: {
            connect: participants,
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error();
    }
    return newChat;
  }
  async postNewMsg(
    chatId: string,
    content: string,
    type: string,
    senderId: string
  ): Promise<MsgEntity | null> {
    let newMsg;
    try {
      newMsg = await this.prisma.message.create({
        data: {
          chatId,
          content,
          type,
          senderId,
        },
      });
    } catch (err) {
      throw new Error();
    }
    return newMsg;
  }
  async fetchChatMsgs(uid: string, chatId: string): Promise<MsgEntity[] | []> {
    let msgs;
    try {
      msgs = await this.prisma.message.findMany({
        where: { chatId, senderId: uid },
      });
      console.log(msgs);
    } catch (err) {
      throw new Error();
    }
    return msgs;
  }
}
