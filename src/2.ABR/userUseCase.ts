import { QueryResult } from 'pg';
import ChatDTO from '../1.EBR/ChatDTO';
import MsgDTO from '../1.EBR/MsgDTO';
import { userResponseType, userSimpleData } from '../1.EBR/Types';
import UserRepository from './user.repository';
import { UserEntity } from '../1.EBR/user.entity';
import { ChatEntity } from '../1.EBR/chat.entity';

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
