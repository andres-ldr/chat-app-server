import UserRepository from './user.repository';
import { UserEntity } from '../1.EBR/user.entity';
import BaseError from '../Utils/BaseError';

export default class UserUsesCases {
  constructor(private readonly userRepository: UserRepository) {}

  public async addNewUser(newUser: UserEntity) {
    let userAuthLimited: {
      uid: string;
      name: string;
      email: string;
      profileImage: string;
    };

    const { uid, name, email, profileImage } =
      await this.userRepository.postNewUser(newUser);

    userAuthLimited = {
      uid,
      name,
      email,
      profileImage,
    };

    return userAuthLimited;
  }

  public async getAllChats(userId: string) {
    return await this.userRepository.fetchAllChats(userId);
  }

  public async getAllContacts(uid: string) {
    return await this.userRepository.fetchAllContacts(uid);
  }

  public async addNewContact(authorId: string, alias: string, email: string) {
    return await this.userRepository.postNewContact(authorId, alias, email);
  }

  public async createNewChat(
    alias: string | null,
    members: [],
    creatorId: string
  ) {
    let num_members: number = members.length;
    let listOfAdmins = [];

    if (num_members < 2) {
      throw new BaseError('A chat must have at least 2 members', 400);
    }

    if (num_members === 2 && alias !== undefined && alias !== null) {
      alias = null;
      //throw new BaseError('A normal chat does not require an alias', 400);
    }
    if (num_members > 2) {
      if (alias === undefined || alias === null) {
        throw new BaseError('A group must have an alias', 400);
      }
      listOfAdmins.push({ uid: creatorId });
    }

    return await this.userRepository.postNewChat(alias, members, listOfAdmins);
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
