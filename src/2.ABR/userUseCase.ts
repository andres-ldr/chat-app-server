import { userResponseType } from '../1.EBR/Types';
import UserRepository from './user.repository';
import { UserEntity } from '../1.EBR/user.entity';
import BaseError from '../Utils/BaseError';

export default class UserUsesCases {
  constructor(private readonly userRepository: UserRepository) {}

  public async addNewUser(newUser: UserEntity) {
    const userCreated: userResponseType = await this.userRepository.postNewUser(
      newUser
    );
    return userCreated;
  }
  public async getAllChats(userId: string) {
    return await this.userRepository.fetchAllChats(userId);
  }
  // public async findUserById(id: string) {
  //   const resp: {
  //     uid: string;
  //     name: string;
  //     lastName: string;
  //     email: string;
  //     password: string;
  //     profileImage: string;
  //     creationDate: Date;
  //   } | null = await this.userRepository.getUserById(id);
  //   return resp;
  // }

  public async getAllContacts(uid: string) {
    return await this.userRepository.fetchAllContacts(uid);
  }

  public async addNewContact(uid: string, alias: string, email: string) {
    return await this.userRepository.postNewContact(uid, alias, email);
  }

  public async createNewChat(alias: string, members: []) {
    let num_members: number = members.length;

    if (num_members < 2) {
      throw new BaseError('A chat must have at least 2 members', 400);
    }
    if (num_members === 2 && alias !== undefined && alias !== null) {
      throw new BaseError('A normal chat does not require an alias', 400);
    }
    if (num_members > 2 && (alias === undefined || alias === null)) {
      throw new BaseError('A group must have an alias', 400);
    }

    return await this.userRepository.postNewChat(alias, members);
  }

  public async sendMsg(
    chatId: string,
    content: string,
    type: string,
    senderId: string
  ) {
    return await this.userRepository.postNewMsg(
      chatId,
      content,
      type,
      senderId
    );
  }

  public async getAllChatMsgs(uid: string, chatId: string) {
    return this.userRepository.fetchChatMsgs(uid, chatId);
  }
}
