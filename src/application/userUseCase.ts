import { MsgEntity } from '../domain/Message';
import { UserEntity } from '../domain/User';
import UserRepository from '../domain/UserRepository';
import prismaClient from '../infrastructure/config/prisma-client';
import PostgresUserRepository from '../infrastructure/repository/postgresUserRepository';

export default class UserUsesCases {
  private static instance: UserUsesCases;

  constructor(private readonly userRepository: UserRepository) {}

  public static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new UserUsesCases(userRepository);
    }
    return this.instance;
  }

  public async addNewUser(newUser: UserEntity) {
    return await this.userRepository.postNewUser(newUser);
  }

  public async updateUser(uid: string, updatedUser: UserEntity) {
    return await this.userRepository.updateUser(uid, updatedUser);
  }

  public async deleteUser(uid: string) {
    return await this.userRepository.deleteUser(uid);
  }

  public async getUsersByNameOrEmail(name: string, email: string) {
    // const userByName = await this.userRepository.getUsersByName(name);
    const userByEmail = await this.userRepository.getUsersByEmail(email);
    // return userByName.concat(userByEmail);
    return userByEmail;
  }

  public async getUserByEmail(email: string) {
    if (!email) return [];
    return (await this.userRepository.getUsersByEmail(email)).slice(0, 5);
  }
}
