import { PrismaClient } from '@prisma/client';
import UserRepository from '../../2.ABR/user.repository';
import bcrypt from 'bcrypt';
import { UserEntity } from '../../1.EBR/user.entity';
import { userResponseType } from '../../1.EBR/Types';
import { ChatEntity } from '../../1.EBR/chat.entity';
import { MsgEntity } from '../../1.EBR/msg.entity';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';
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
        throw new BaseError(
          'Chat or group already exists',
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async contactExists(authorId: string, email: string): Promise<{} | null> {
    return await this.prisma.contact.findFirst({
      where: {
        authorId,
        email,
      },
    });
  }
  async emailExists(email: string): Promise<userResponseType> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async userExists(uid: string): Promise<userResponseType> {
    return await this.prisma.user.findUnique({ where: { uid } });
  }
  async fetchAllChats(userId: string): Promise<ChatEntity[] | []> {
    let AllChats;
    try {
      AllChats = await this.prisma.chat.findMany({
        where: { members: { some: { uid: userId } } },
      });
    } catch (err) {
      let error: Error = err as Error;
      throw new BaseError(
        `Couldn't fetch all chats`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return AllChats;
  }

  async getUserById(uuid: string): Promise<UserEntity | null> {
    let result;
    try {
      result = await this.userExists(uuid);
      if (!result) {
        throw new BaseError('User does not exists', 404);
      }
    } catch (err) {
      let error: Error = err as Error;
      throw new BaseError(
        `Couldn't get user by id`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return result;
  }
  async postNewUser(user: UserEntity): Promise<userResponseType> {
    const { name, lastName, email, password, profileImage } = user;
    let result;
    try {
      if (!(await this.emailExists(email))) {
        throw new BaseError('No email found', 404);
      }

      const hash = await bcrypt.hash(password, 10);
      result = await this.prisma.user.create({
        data: { name, lastName, email, password: `${hash}`, profileImage },
      });
    } catch (err) {
      let error: Error = err as Error;
      throw new BaseError(
        `Couldn't create user`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return result;
  }
  async fetchAllContacts(uid: string): Promise<{}[]> {
    let result;
    try {
      if (!(await this.userExists(uid))) {
        throw new BaseError('User does not exists', 404);
      }
      result = await this.prisma.contact.findMany({ where: { authorId: uid } });
    } catch (err) {
      let error: Error = err as Error;
      throw new BaseError(
        `Couldn't fetch contacts`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return result;
  }
  async postNewContact(
    userId: string,
    alias: string,
    email: string
  ): Promise<{ email: string; authorId: string; alias: string } | null> {
    let result;

    try {
      if (!(await this.userExists(userId))) {
        throw new BaseError('No user found', 404);
      }
      if (!(await this.emailExists(email))) {
        throw new BaseError('No email found', 404);
      }
      if (await this.contactExists(userId, email)) {
        throw new BaseError('Contact already exists', 404);
      }
      result = await this.prisma.contact.create({
        data: {
          alias,
          email,
          authorId: userId,
        },
      });
    } catch (err) {
      let error: Error = err as Error;
      throw new BaseError(
        `Contact couldn't be created`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
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
      let error: Error = err as Error;
      throw new BaseError(
        `Chat couldn't be created`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
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
      let error: Error = err as Error;
      throw new BaseError(
        `Could not send message, maybe chat or user are wrong`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
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
      let error: Error = err as Error;
      throw new BaseError(
        `Could not get messages, maybe chat or user are wrong`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return msgs;
  }
}
