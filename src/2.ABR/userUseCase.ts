import { userResponseType } from '../1.EBR/Types';
import UserRepository from './user.repository';
import { UserEntity } from '../1.EBR/user.entity';
import BaseError from '../Utils/BaseError';
import TokenRepository from './token.repository';

export default class UserUsesCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  public async addNewUser(newUser: UserEntity) {
    let tokenGen;
    let userAuthLimited: {
      name: string;
      email: string;
      profileImage: string;
    } = { name: '', email: '', profileImage: '' };

    const userCreated = await this.userRepository.postNewUser(newUser);

    tokenGen = this.tokenRepository.generateToken(userCreated.uid);

    userAuthLimited = {
      name: userCreated.name,
      email: userCreated.email,
      profileImage: userCreated.profileImage,
    };

    return { userAuthLimited, tokenGen };
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

  public async authUser(email: string, password: string) {
    let tokenGen;
    let userAuthLimited: {
      name: string;
      email: string;
      profileImage: string;
    } = { name: '', email: '', profileImage: '' };

    const userAuth = await this.userRepository.authenticateUser(
      email,
      password
    );

    userAuthLimited = {
      name: userAuth.name,
      email: userAuth.email,
      profileImage: userAuth.profileImage,
    };

    tokenGen = this.tokenRepository.generateToken(userAuth.uid);

    return { userAuthLimited, tokenGen };
  }

  public checkAuth(token: string) {
    return this.tokenRepository.verifyToken(token);
  }
}
