import { UserEntity } from '../enterprise-rules/user.entity';
import UserRepository from './user.repository';

export default class UserUsesCases {
  constructor(private readonly userRepository: UserRepository) {}

  public async addNewUser(newUser: UserEntity) {
    return await this.userRepository.postNewUser(newUser);
  }

  public async getAllChats(uid: string) {
    const chats = await this.userRepository.fetchAllChats(uid);

    const newChats: { cid: string; alias: string; chatImage: string }[] =
      await Promise.all(
        chats.map(async ({ cid, alias, chatImage }) => {
          if (!alias) {
            const { email, profileImage } =
              await this.userRepository.findTheOtherMemberOfAChat(cid, uid);
            const contact = await this.userRepository.findUsersContactByEmail(
              uid,
              email
            );

            if (contact) {
              return {
                cid,
                alias: contact.alias,
                chatImage: contact.profileImage,
              };
            } else {
              return {
                cid,
                alias: email,
                chatImage: profileImage,
              };
            }
          } else {
            return {
              cid,
              alias,
              chatImage,
            };
          }
        })
      );

    return newChats;
  }

  public async getAllContacts(uid: string) {
    return await this.userRepository.fetchAllContacts(uid);
  }

  public async addNewContact(authorId: string, alias: string, email: string) {
    return await this.userRepository.postNewContact(authorId, alias, email);
  }

  public async getChatByMembers(
    alias: string | null,
    members: [],
    uid: string,
    adminId: {
      uid: string;
    }[],
    chatImage: string | null
  ) {
    const existingChat = await this.userRepository.findChatByMembers(
      alias,
      members
    );

    if (existingChat) {
      return await this.getChatById(uid, existingChat.cid);
    } else {
      const newChat = await this.createChat(alias, members, adminId, chatImage);
      return await this.getChatById(uid, newChat.cid);
    }
  }

  public async createChat(
    alias: string | null,
    members: [],
    adminId: {
      uid: string;
    }[],
    chatImage: string | null
  ) {
    return await this.userRepository.postNewChat(
      alias,
      members,
      adminId,
      chatImage
    );
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

  public async getChatById(uid: string, chatId: string) {
    const { cid, alias, chatImage } = await this.userRepository.fetchChatById(
      uid,
      chatId
    );
    const chat = await this.userRepository.fetchChatMsgs(chatId);
    const members = await this.userRepository.fetchChatMembers(chatId);

    if (members.length > 2) {
      return { cid, alias, chatImage, chat };
    } else {
      const { email, profileImage } = members.find(
        (member) => member.uid !== uid
      ) as UserEntity;

      const contact = await this.userRepository.isAnUserContact(uid, email);
      if (contact) {
        return { cid, alias: contact.alias, chatImage: profileImage, chat };
      } else {
        return { cid, alias: email, chatImage: profileImage, chat };
      }
    }
  }
}
