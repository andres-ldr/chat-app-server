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
    profile_image,
  }: userSimpleData) {
    const userValue = new UserDTO({ name, last_name, email, profile_image });
    const userCreated = await this.userRepository.postNewUser(userValue);
    return userCreated;
  }
  public async findUserById(id: string) {
    const resp: UserDTO = await this.userRepository.getUserById(id);
    return resp;
  }

  public async getAllUsers() {
    const allUsers: UserDTO[] = await this.userRepository.fetchAllUsers();
    return allUsers;
  }

  public async addNewContact(uid: string, email: string) {
    const message = this.userRepository.postNewContact(uid, email);
    return message;
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
}
