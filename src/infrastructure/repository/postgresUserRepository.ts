import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import UserRepository from '../../domain/UserRepository';

export default class PostgresUserRepository implements UserRepository<User> {
  private static instance: PostgresUserRepository;

  constructor(readonly prisma: PrismaClient) {}

  async getUsersByEmail(email: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        email,
      },
    });
  }

  async getUsersByName(name: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        name,
      },
    });
  }

  async updateUser(uid: string, user: User): Promise<User> {
    const { password } = user;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return await this.prisma.user.update({
      where: { uid },
      data: user,
    });
  }

  async deleteUser(uid: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { uid },
    });
  }

  async getUserById(uid: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { uid },
    });
  }

  async postNewUser(user: User): Promise<User> {
    const { name, lastName, email, password, profileImage } = user;

    const hash = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: { name, lastName, email, password: `${hash}`, profileImage },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async emailExists(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async userExists(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getMembersOfAChat(cid: string): Promise<User[]> {
    const members = await this.prisma.user.findMany({
      where: {
        chats: {
          some: {
            cid,
          },
        },
      },
    });
    return members;
  }

  /**
   * Get all the admins of a group chat
   * @param cid Chat id
   * @returns Users that are admins of the group chat
   */
  async getAdminsOfAGroupChat(cid: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        chatsWhichImAdmin: {
          some: {
            cid,
          },
        },
        chats: {
          some: {
            cid,
          },
        },
      },
    });
  }

  static getInstance(prisma: PrismaClient): PostgresUserRepository {
    if (!PostgresUserRepository.instance) {
      PostgresUserRepository.instance = new PostgresUserRepository(prisma);
    }
    return PostgresUserRepository.instance;
  }
}
