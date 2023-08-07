import ChatDTO from '../../1.EBR/ChatDTO';
import MsgDTO from '../../1.EBR/MsgDTO';
import { Prisma, PrismaClient } from '@prisma/client';
import { UserDTO } from '../../1.EBR/UserDTO';
import UserRepository from '../../2.ABR/user.repository';
import bcrypt from 'bcrypt';
require('dotenv').config();

export default class PostgresRepository implements UserRepository {
  prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserById(uuid: string): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null> {
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
  async postNewUser(user: UserDTO): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null> {
    const { name, last_name, email, password, profile_image } = user;
    let result;

    try {
      const hash = await bcrypt.hash(password, 10);

      console.log(user);
      result = await this.prisma.user.create({
        data: { name, last_name, email, password: `${hash}`, profile_image },
      });
      console.log(result);
    } catch (err) {
      throw new Error();
    } finally {
      //this.userClient.$disconnect();
    }
    return result;
  }
  async fetchAllUsers(): Promise<
    | {
        uid: string;
        name: string;
        last_name: string;
        email: string;
        profile_image: string;
        creation_date: Date;
      }[]
    | null
  > {
    let result;
    try {
      //this.userClient.$connect();
      result = this.prisma.user.findMany();
    } catch (err) {
      throw new Error();
    } finally {
      //this.userClient.$disconnect();
    }
    return result;
  }
  async postNewContact(
    userId: string,
    email: string
  ): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null> {
    let contact;
    let result;
    try {
      //this.userClient.$connect();
      contact = await this.prisma.user.findFirst({
        where: { email },
      });
      const user = await this.getUserById(userId);

      if (!contact) {
        return contact;
      }

      if (!user) {
        throw new Error();
      }

      const contactId = contact.uid;
      result = await this.prisma.contact.create({
        data: { userId, contactId },
      });
    } catch (err) {
      throw new Error();
    } finally {
      //this.userClient.$disconnect();
    }
    return null;
  }
  async postNewChat(chat: ChatDTO): Promise<ChatDTO> {
    throw new Error('Method not implemented.');
  }
  async postNewMsg(msg: MsgDTO, chatId: string): Promise<MsgDTO> {
    throw new Error('Method not implemented.');
  }
  async fetchChatMsgs(chatId: string): Promise<MsgDTO[]> {
    throw new Error('Method not implemented.');
  }
}
