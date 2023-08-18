import { Prisma, PrismaClient } from '@prisma/client';
import UserRepository from '../../2.ABR/user.repository';
import bcrypt from 'bcrypt';
import { UserEntity } from '../../1.EBR/user.entity';
import { ChatEntity } from '../../1.EBR/chat.entity';
import { MsgEntity } from '../../1.EBR/msg.entity';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';
import ContactEntity from '../../1.EBR/Contact.entity';
import { Pool } from 'pg';
require('dotenv').config();

export default class PostgresRepository implements UserRepository {
  readonly prisma;
  readonly pool;
  constructor() {
    this.prisma = new PrismaClient();
    this.pool = new Pool({
      user: `${process.env.POSTGRES_USER}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      host: `${process.env.POSTGRES_HOST}`,
      port: Number(process.env.POSTGRES_PORT),
      database: `${process.env.POSTGRES_DB}`,
    });
  }

  async lookUpForExistingChat(alias: string | null, participants: []) {
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
        authorId: {
          equals: authorId,
        },
        email: {
          equals: email,
        },
      },
    });
  }
  async emailExists(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async userExists(uid: string): Promise<UserEntity> {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { uid } });
    } catch (error) {
      throw new BaseError('No user found', 404);
    }
  }
  async fetchAllChats(userId: string): Promise<ChatEntity[] | []> {
    let AllChats: ChatEntity[];
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
  async postNewUser(user: UserEntity): Promise<UserEntity> {
    const { name, lastName, email, password, profileImage } = user;
    let result;
    try {
      if (await this.emailExists(email)) {
        throw new BaseError('User already exists', HttpStatusCode.BAD_REQUEST);
      }

      const hash = await bcrypt.hash(password, 10);
      result = await this.prisma.user.create({
        data: { name, lastName, email, password: `${hash}`, profileImage },
      });
    } catch (err) {
      let error: Error = err as Error;

      throw new BaseError(
        `${error.message}`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }

    return result;
  }
  async fetchAllContacts(uid: string): Promise<{}[]> {
    let result;
    try {
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
    authorId: string,
    alias: string,
    email: string
  ): Promise<ContactEntity> {
    let contactCreated;

    try {
      if (!(await this.emailExists(email))) {
        throw new BaseError('User not found', HttpStatusCode.NOT_FOUND);
      }

      if (await this.contactExists(authorId, email)) {
        throw new BaseError('Contact already exists', 404);
      }
      contactCreated = await this.prisma.contact.create({
        data: {
          alias,
          email,
          authorId,
        },
      });
    } catch (err) {
      let error: BaseError = err as BaseError;
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (err.code === 'P2023') {
          error.message =
            'There is a unique constraint violation, a new user cannot be created with this email';
          error.code = HttpStatusCode.INTERNAL_SERVER_ERROR;
        }
      }
      throw new BaseError(`${error.message}`, error.code, error.stack);
    }

    return contactCreated;
  }
  async postNewChat(
    alias: string | null,
    members: [],
    lisOfAdmins: { uid: string }[]
  ): Promise<ChatEntity> {
    let newChat: ChatEntity;

    try {
      await this.lookUpForExistingChat(alias, members);

      newChat = await this.prisma.chat.create({
        data: {
          alias,
          members: {
            connect: members,
          },
          admins: {
            connect: lisOfAdmins,
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
  ): Promise<MsgEntity> {
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
        where: { chatId },
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
