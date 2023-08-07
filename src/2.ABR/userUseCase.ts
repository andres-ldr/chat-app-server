import { QueryResult } from 'pg';
import ChatDTO from '../1.EBR/ChatDTO';
import MsgDTO from '../1.EBR/MsgDTO';
import { UserDTO, userSimpleData } from '../1.EBR/UserDTO';
import { MSG_TYPE } from '../1.EBR/msg.entity';
import UserRepository from './user.repository';

export default class UserUsesCases {
  constructor(private readonly userRepository: UserRepository) {}

  public async addNewUser({
    name,
    last_name,
    email,
    password,
    profile_image,
  }: userSimpleData) {
    const userValue = new UserDTO({
      name,
      last_name,
      email,
      password,
      profile_image,
    });
    const userCreated: {
      uid: string;
      name: string;
      last_name: string;
      email: string;
      profile_image: string;
      creation_date: Date;
    } | null = await this.userRepository.postNewUser(userValue);
    return userCreated;
  }
  public async findUserById(id: string) {
    const resp: {
      uid: string;
      name: string;
      last_name: string;
      email: string;
      profile_image: string;
      creation_date: Date;
    } | null = await this.userRepository.getUserById(id);
    return resp;
  }

  public async getAllUsers() {
    const allUsers:
      | {
          uid: string;
          name: string;
          last_name: string;
          email: string;
          profile_image: string;
          creation_date: Date;
        }[]
      | null = await this.userRepository.fetchAllUsers();
    return allUsers;
  }

  public async addNewContact(uid: string, email: string) {
    const response: {
      uid: string;
      name: string;
      last_name: string;
      email: string;
      profile_image: string;
      creation_date: Date;
    } | null = await this.userRepository.postNewContact(uid, email);
    return response;
  }

  public async createNewChat(contactId: string, userId: string) {
    const chatValue = new ChatDTO({
      messages: [],
      members: [contactId, userId],
    });
    const chatCreated = await this.userRepository.postNewChat(chatValue);
    return chatCreated;
  }

  public async sendMsg(content: string, sender: string, chat: string) {
    const msgValue = new MsgDTO({
      content,
      sender,
      type: MSG_TYPE.TEXT,
    });
    const msgSent = await this.userRepository.postNewMsg(msgValue, chat);
    return msgSent;
  }

  public async getAllChatMsgs(chatId: string) {
    const msgs = this.userRepository.fetchChatMsgs(chatId);
    return msgs;
  }
}
