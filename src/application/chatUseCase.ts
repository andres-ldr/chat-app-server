import { ChatEntity } from '../domain/Chat';
import ChatRepository from '../domain/ChatRepository';
import { MsgEntity } from '../domain/Message';
import { UserEntity } from '../domain/User';
import UserRepository from '../domain/UserRepository';

export default class ChatUseCases {
  private static instance: ChatUseCases;

  constructor(
    private readonly chatRepository: ChatRepository<
      ChatEntity,
      UserEntity,
      MsgEntity
    >,
    private readonly userRepository: UserRepository<UserEntity>
  ) {}

  public async createChat(members: string[]) {
    if (members.length < 2) throw new Error('Members must be at least 2');
    const chat = await this.chatRepository.getChatByMembers(members);
    if (chat) throw new Error('Chat already exists');

    const newChat = await this.chatRepository.postNewChat(members);

    return newChat;
  }

  public async getChats(userId: string) {
    const chats = await this.chatRepository.getChats(userId);
    return chats;
  }

  public async deleteChat(cid: string, uid: string) {
    const chatDeleted = await this.chatRepository.deleteChat(cid, uid);

    return chatDeleted;
  }

  public async createGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
  }) {
    // check the group doesn't exist

    if (chatData.admins.length === 0) throw new Error("Admins can't be empty");

    if (chatData.members.length === 0)
      throw new Error("Members can't be empty");

    const newGroup = await this.chatRepository.postNewGroup(chatData);
    return newGroup;
  }

  public async addMembersToGroup(chatData: {
    cid: string;
    members: string[];
    adminId: string;
  }) {
    // TODO: check if member is in group already
    // if true return ...
    // else add to group

    const chatUpdated = await this.chatRepository.addMembersToGroup(
      chatData,
      chatData.adminId
    );

    return chatUpdated;
  }

  public async removeMembersFromGroup(chatData: {
    cid: string;
    members: string[];
    adminId: string;
  }) {
    // TODO: check if members are in group already
    // if false return ...
    // else remove to group

    const chatUpdated = await this.chatRepository.updateGroup(
      chatData,
      chatData.adminId
    );

    return chatUpdated;
  }

  public async updateGroup(
    chatData: {
      cid: string;
      alias: string;
      chatImage: string;
      admins: string[];
      members: string[];
    },
    adminId: string
  ) {
    const chat = await this.chatRepository.getChatById(chatData.cid);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // When members are removed
    if (chatData.members.length < chat.members.length) {
      const removedMembers = chat.members.filter(
        (user) => !chatData.members.includes(user.uid as string)
      );
      await this.chatRepository.removeMembersFromGroup(
        {
          cid: chatData.cid,
          members: removedMembers.map((e) => e.uid as string),
        },
        adminId
      );
      // when members are added
    } else if (chatData.members.length > chat.members.length) {
      const addedMembers = chatData.members.filter((uid) => {
        return !chat.members.some((e) => e.uid === uid);
      });
      await this.chatRepository.addMembersToGroup(
        {
          cid: chatData.cid,
          members: addedMembers,
        },
        adminId
      );
    }

    // When admins are removed
    if (chatData.admins.length < chat.admins.length) {
      const removedAdmins = chat.admins.filter(
        (user) => !chatData.admins.includes(user.uid as string)
      );
      await this.chatRepository.removeAdminsFromGroup(
        {
          cid: chatData.cid,
          admins: removedAdmins.map((e) => e.uid as string),
        },
        adminId
      );
      // when admins are added
    } else if (chatData.admins.length > chat.admins.length) {
      const addedAdmins = chatData.admins.filter((uid) => {
        return !chat.admins.some((e) => e.uid === uid);
      });
      await this.chatRepository.addAdminsToGroup(
        {
          cid: chatData.cid,
          admins: addedAdmins,
        },
        adminId
      );
    }

    if (
      chatData.alias !== chat.alias ||
      chatData.chatImage !== chat.chatImage
    ) {
      await this.chatRepository.updateGroup(chatData, adminId);
    }

    return chat;
  }

  public async deleteGroup(chatData: { cid: string; adminId: string }) {
    const chat = await this.chatRepository.deleteGroup(chatData);
    return chat;
  }

  // public async exitGroup(chatData: { cid: string; userId: string }) {
  //   // is user admin of the group ?
  //   const isAdmin = await this.chatRepository.checkIfUserIsAdmin(
  //     chatData.cid,
  //     chatData.userId
  //   );
  //   if (isAdmin) {
  //     // remove curret admin from admins
  //     // await this.chatRepository.deleteAdmins({
  //     //   cid: chatData.cid,
  //     //   userIds: Array(chatData.userId),
  //     // });
  //     // if true, reassign admin to another member
  //     const members = await this.userRepository.getMembersOfAChat(chatData.cid);

  //     // remove current admin from members
  //     const newAdmin = members.filter(
  //       (e: UserEntity) => e.uid !== chatData.userId
  //     )[0];

  //     await this.chatRepository.postAdmins({
  //       cid: chatData.cid,
  //       userIds: Array(newAdmin.uid),
  //     });
  //   }
  //   return await this.chatRepository.exitGroup(chatData);
  // }

  public static getInstance(
    chatRepository: ChatRepository<ChatEntity, UserEntity, MsgEntity>,
    userRepository: UserRepository<UserEntity>
  ) {
    if (!this.instance) {
      this.instance = new ChatUseCases(chatRepository, userRepository);
    }
    return this.instance;
  }
}
