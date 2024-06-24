import { UserEntity } from './User';

export default interface ChatRepository {
  getChatById(
    id: string
  ): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  } | null>;
  getChats(userId: string): Promise<
    {
      cid: string;
      alias: string | null;
      creationDate: Date;
      chatImage: string | null;
      isGroup: boolean;
    }[]
  >;
  getChatByMembers(chats: string): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  } | null>;
  deleteChat(
    cid: string,
    uid: string
  ): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  postNewChat(members: UserEntity[]): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: UserEntity[];
    members: UserEntity[];
  }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  updateGroup(chatData: {
    cid: string;
    alias: string;
    chatImage: string;
    adminId: string;
    admins: UserEntity[];
    members: UserEntity[];
  }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  addMembersToGroup(chatData: {
    cid: string;
    members: string[];
    adminId: string;
  }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  removeMembersFromGroup(chatData: {
    cid: string;
    members: string[];
    adminId: string;
  }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  deleteGroup(chatData: { cid: string; adminId: string }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  exitGroup(chatData: { cid: string; userId: string }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  checkIfUserIsAdmin(
    cid: string,
    userId: string
  ): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  } | null>;
  postAdmins(chatData: { cid: string; userIds: string[] }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
  deleteAdmins(chatData: { cid: string; userIds: string[] }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }>;
}
