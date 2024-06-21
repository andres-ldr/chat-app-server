import { ChatEntity } from '../domain/Chat';
import ChatRepository from '../domain/ChatRepository';
import { UserEntity } from '../domain/User';
import UserRepository from '../domain/UserRepository';

export default class ChatUseCases {
  private static instance: ChatUseCases;

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async createChat(chatData: ChatEntity) {
    const members = await Promise.all(
      chatData.members.map((e) => this.userRepository.getUserById(e))
    );

    const chat = await this.chatRepository.postNewChat(members);
    const newChat = {
      ...chat,
      members: members,
    };

    return newChat;
  }

  public async getChats(userId: string) {
    // get chat of an user
    const chats = await this.chatRepository.getChats(userId);
    if (!chats) return [];

    const res = chats.map(async (chat: ChatEntity) => {
      const members = await this.userRepository.getMembersOfAChat(chat.cid);
      if (chat.isGroup) {
        // TODO: CHECK IF USER IS ADMIN
        const admins = await this.userRepository.getAdminsOfAGroupChat(
          chat.cid
        );

        return {
          ...chat,
          members,
          admins,
        };
      } else {
        const receiver = members.filter((e) => e.uid !== userId)[0];
        // TODO: GET LAST MESSAGE OF EACH CHAT
        // const lastMessage = await this.chatRepository.getLastMessage(chat.cid);
        
        // TODO: RETURN CONTACT DATA IF CHAT IS WITH A CONTACT
        // const contact = await this.userRepository.checkIfContact();
        /**
         * if (contact) {
         * return {
         * ...chat,
         * alias: contact.name,
         * members,
         *  }
         * } else {
         * return {
         * ...chat,
         * alias: receiver.name,
         * chatImage: receiver.profileImage,
         * members,
         *  }
         * }
         * 
         * 
        */
       
        return {
          ...chat,
          alias: receiver.name,
          chatImage: receiver.profileImage,
          members,
        };
      }
    });

    const chatRes = Promise.all(res);

    return chatRes;
  }

  public async deleteChat(cid: string, uid: string) {
    return await this.chatRepository.deleteChat(cid, uid);
  }

  public async createGroup(chatData: any) {
    const admins = await Promise.all(
      chatData.admins.map((e: string) => this.userRepository.getUserById(e))
    );
    const members = await Promise.all(
      chatData.members.map((e: string) => this.userRepository.getUserById(e))
    );

    chatData = {
      ...chatData,
      admins,
      members,
    };

    return await this.chatRepository.postNewGroup(chatData);
  }

  public async addMembersToGroup({
    cid,
    members,
  }: {
    cid: string;
    members: string[];
    adminId: string;
  }) {
    // get users based on uid
    const users = await Promise.all(
      members.map((e: string) => this.userRepository.getUserById(e))
    );

    // TODO: check if member is in group already
    // if true return ...
    // else add to group

    const chatData = {
      cid,
      members: users,
    };

    return await this.chatRepository.addMembersToGroup(chatData);
  }

  public async removeMembersFromGroup({
    cid,
    members,
  }: {
    cid: string;
    members: string[];
    adminId: string;
  }) {
    // get users based on uid
    const users = await Promise.all(
      members.map((e: string) => this.userRepository.getUserById(e))
    );

    // TODO: check if members are in group already
    // if false return ...
    // else remove to group

    const chatData = {
      cid,
      members: users,
    };

    return await this.chatRepository.removeMembersFromGroup(chatData);
  }

  public async updateGroup(chatData: {
    cid: string;
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
    adminId: string;
  }) {
    // TODO: check if exist
    const chat = await this.chatRepository.getChatById(chatData.cid);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // GET CHAT
    const currentAdmins = await this.userRepository.getAdminsOfAGroupChat(
      chat.cid
    );

    // if user is admin
    if (!currentAdmins.find((e) => e.uid === chatData.adminId)) {
      throw new Error('User is not admin of the group');
    }
    const currentAdminIds = currentAdmins.map((e) => e.uid);
    let newAdmins = null;

    // adding new admins
    if (currentAdminIds.length < chatData.admins.length) {
      newAdmins = chatData.admins.filter((e) => !currentAdminIds.includes(e));
      const adminAdded = await this.chatRepository.postAdmins({
        cid: chatData.cid,
        userIds: newAdmins,
      });
    } else {
      // removing admins
      newAdmins = currentAdminIds.filter((e) => !chatData.admins.includes(e));
      //TODO: DISCONNECT USERS FROM CHAT
      const adminRemoved = await this.chatRepository.deleteAdmins({
        cid: chatData.cid,
        userIds: newAdmins,
      });
    }
    // get users based on uid
    const admins = await Promise.all(
      newAdmins.map((e: string) => this.userRepository.getUserById(e))
    );

    const currentMembers = await this.userRepository.getMembersOfAChat(
      chat.cid
    );
    const memberIds = currentMembers.map((e) => e.uid);

    let newMembers = null;
    if (currentMembers.length < chatData.members.length) {
      newMembers = chatData.members.filter((e) => !memberIds.includes(e));
      const memberCreated = await this.chatRepository.addMembersToGroup({
        cid: chatData.cid,
        members: newMembers,
        adminId: chatData.adminId,
      });
      console.log(memberCreated);
    } else {
      // TODO: DISCONNECT USERS FROM CHAT
      newMembers = memberIds.filter((e) => !chatData.members.includes(e));
      const memberDeleted = await this.chatRepository.removeMembersFromGroup({
        cid: chatData.cid,
        members: newMembers,
        adminId: chatData.adminId,
      });
      console.log(memberDeleted);
    }

    const members = await Promise.all(
      newMembers.map((e: string) => this.userRepository.getUserById(e))
    );

    if (!chatData.chatImage) {
      chatData.chatImage = chat.chatImage;
    }

    return await this.chatRepository.updateGroup(
      chatData
      // admins,
      // members,
    );
  }

  public async deleteGroup(chatData: { cid: string; adminId: string }) {
    const chat = await this.chatRepository.deleteGroup(chatData);
    return chat;
  }

  public async exitGroup(chatData: { cid: string; userId: string }) {
    // is user admin of the group ?
    const isAdmin = await this.chatRepository.checkIfUserIsAdmin(
      chatData.cid,
      chatData.userId
    );
    if (isAdmin) {
      // remove curret admin from admins
      // await this.chatRepository.deleteAdmins({
      //   cid: chatData.cid,
      //   userIds: Array(chatData.userId),
      // });
      // if true, reassign admin to another member
      const members = await this.userRepository.getMembersOfAChat(chatData.cid);

      // remove current admin from members
      const newAdmin = members.filter(
        (e: UserEntity) => e.uid !== chatData.userId
      )[0];

      const newAdminAdded = await this.chatRepository.postAdmins({
        cid: chatData.cid,
        userIds: Array(newAdmin.uid),
      });
    }
    return await this.chatRepository.exitGroup(chatData);
  }

  public static getInstance(
    chatRepository: ChatRepository,
    userRepository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new ChatUseCases(chatRepository, userRepository);
    }
    return this.instance;
  }
}
