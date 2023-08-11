import { PrismaClient } from '@prisma/client';
import UserRepository from '../../2.ABR/user.repository';
import bcrypt from 'bcrypt';
import { UserEntity } from '../../1.EBR/user.entity';
import { userResponseType } from '../../1.EBR/Types';
import { ChatEntity } from '../../1.EBR/chat.entity';
import { MsgEntity } from '../../1.EBR/msg.entity';
import BaseError from '../../Utils/BaseError';
require('dotenv').config();

export default class PostgresRepository implements UserRepository {
  prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async lookUpForExistingChat(alias: string, participants: []) {
    let ids: string[] = [];
    try {
      participants.forEach((obj: { uid: string }) => ids.push(obj.uid));

      let isChatExisting = await this.prisma.chat.findFirst({
        where: {
          AND: [
            { alias: { equals: alias } },
            {
              members: {
                every: {
                  uid: {
                    in: ids,
                  },
                },
              },
            },
          ],
        },
      });

      if (isChatExisting) {
        throw new BaseError('Chat or group already exists', 400);
      }
    } catch (error) {
      throw error;
    }
  }
  async contactExists(authorId: string, email: string) {
    try {
      let count = await this.prisma.contact.count({
        where: {
          authorId,
          email,
        },
      });
      if (count > 0) {
        throw new BaseError('Contact already exists', 404);
      }
    } catch (error) {
      throw error;
    }
  }
  async emailExists(email: string): Promise<boolean> {
    let res;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }
  async userExists(uid: string) {
    try {
      await this.prisma.user.findUniqueOrThrow({ where: { uid } });
    } catch (err) {
      throw new BaseError('No user found', 404);
    }
  }
  async fetchAllChats(userId: string): Promise<ChatEntity[] | []> {
    let AllChats;
    try {
      await this.userExists(userId);
      AllChats = await this.prisma.chat.findMany({
        where: { members: { every: { uid: userId } } },
      });
    } catch (err) {
      throw new BaseError(`${err}`, 400);
    }
    return AllChats;
  }

  async getUserById(uuid: string): Promise<UserEntity | null> {
    let result;
    try {
      result = this.prisma.user.findUnique({ where: { uid: `${uuid}` } });
      if (result === undefined) {
        throw new BaseError('No user found', 404);
      }
    } catch (err) {
      throw err;
    }
    return result;
  }
  async postNewUser(user: UserEntity): Promise<userResponseType> {
    const { name, lastName, email, password, profileImage } = user;
    let result;
    try {
      if (await this.emailExists(email)) {
        throw new BaseError('No email found', 404);
      }

      const hash = await bcrypt.hash(password, 10);
      result = await this.prisma.user.create({
        data: { name, lastName, email, password: `${hash}`, profileImage },
      });
    } catch (err) {
      throw err;
    }
    return result;
  }
  async fetchAllContacts(uid: string): Promise<{}[]> {
    let result;
    try {
      result = await this.prisma.contact.findMany({ where: { authorId: uid } });
    } catch (err) {
      throw err;
    }
    return result;
  }
  async postNewContact(
    userId: string,
    alias: string,
    email: string
  ): Promise<{ email: string; authorId: string; alias: string } | null> {
    let result;

    await this.userExists(userId);
    if (!(await this.emailExists(email))) {
      throw new BaseError('No email found', 404);
    }
    await this.contactExists(userId, email);
    try {
      result = await this.prisma.contact.create({
        data: {
          alias,
          email,
          authorId: userId,
        },
      });
    } catch (err) {
      throw err;
    }

    return result;
  }
  async postNewChat(
    alias: string,
    participants: []
  ): Promise<ChatEntity | null> {
    let newChat;

    try {
      await this.lookUpForExistingChat(alias, participants);

      newChat = await this.prisma.chat.create({
        data: {
          alias,
          members: {
            connect: participants,
          },
        },
      });
    } catch (err) {
      throw err;
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
      throw err;
    }
    return newMsg;
  }
  async fetchChatMsgs(uid: string, chatId: string): Promise<MsgEntity[] | []> {
    let msgs;
    try {
      msgs = await this.prisma.message.findMany({
        where: { chatId, senderId: uid },
      });
    } catch (err) {
      throw err;
    }
    return msgs;
  }
}
