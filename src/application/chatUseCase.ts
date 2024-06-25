import ChatRepository from '../domain/ChatRepository';
import UserRepository from '../domain/UserRepository';

export default class ChatUseCases {
  private static instance: ChatUseCases;

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async createChat(members: string[]) {
    if (members.length < 2) throw new Error('Members must be at least 2');
    const chat = await this.chatRepository.getChatByMembers(members);
    if (chat) throw new Error('Chat already exists');
    const newChat = await this.chatRepository.postNewChat(members);
    if (!newChat) throw new Error('Error creating chat');
    return { message: 'Chat created' };
  }

  public async getChats(userId: string) {
    const chats = await this.chatRepository.getChats(userId);
    return chats;
  }

  public async deleteChat(cid: string, uid: string) {
    const chatDeleted = await this.chatRepository.deleteChat(cid, uid);
    if (!chatDeleted) throw new Error('Error deleting chat');
    return { message: 'Chat deleted' };
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
    if (!newGroup) throw new Error('Error creating group');
    return { message: 'Group created' };
  }

  // public async addMembersToGroup(chatData: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }) {
  //   // TODO: check if member is in group already
  //   // if true return ...
  //   // else add to group

  //   const chatUpdated = await this.chatRepository.addMembersToGroup(chatData);
  //   if (!chatUpdated) throw new Error('Error adding members to group');

  //   return { message: 'Members added to group' };
  // }

  // public async removeMembersFromGroup(chatData: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }) {
  //   // TODO: check if members are in group already
  //   // if false return ...
  //   // else remove to group

  //   const chatUpdated = await this.chatRepository.removeMembersFromGroup(
  //     chatData
  //   );

  //   if (!chatUpdated) throw new Error('Error removing members from group');
  //   return { message: 'Members removed from group' };
  // }

  public async updateGroup(
    chatData: {
      cid: string;
      alias: string;
      chatImage: string | null;
      admins: string[];
      members: string[];
    },
    adminId: string
  ) {
    // TODO: check if exist
    const chat = await this.chatRepository.getChatById(chatData.cid);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const groupUdated = await this.chatRepository.updateGroup(chatData, adminId);
    if (!groupUdated) throw new Error('Error updating group');
    console.log(groupUdated);
    
    return { message: 'Group updated' };
  }

  public async deleteGroup(chatData: { cid: string; adminId: string }) {
    const chat = await this.chatRepository.deleteGroup(chatData);
    if (!chat) throw new Error('Error deleting group');
    return { message: 'Group deleted' };  
    
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
    chatRepository: ChatRepository,
    userRepository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new ChatUseCases(chatRepository, userRepository);
    }
    return this.instance;
  }
}
