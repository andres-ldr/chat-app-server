import { ChatEntity } from './Chat';
import { MsgEntity } from './Message';
import { UserEntity } from './User';
// import { Chat } from './Chat';

export type ChatDetails<TChat, TUser, TMessage> =
  | (TChat & {
      members: Partial<TUser>[];
      admins: Partial<TUser>[];
      messages: Partial<TMessage>[];
    })
  | null;

export default interface ChatRepository<
  T extends ChatEntity,
  U extends UserEntity,
  V extends MsgEntity
> {
  getChatById(id: string): Promise<ChatDetails<T, U, V>>;
  getChats(userId: string): Promise<ChatDetails<T, U, V>[]>;
  getChatByMembers(members: string[]): Promise<ChatDetails<T, U, V>>;
  deleteChat(cid: string, uid: string): Promise<T>;
  postNewChat(members: string[]): Promise<T & Partial<U>>;
  postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
  }): Promise<
    T & {
      members: Partial<U>[];
      admins: Partial<U>[];
    }
  >;
  updateGroup(
    chatData: {
      cid: string;
      alias?: string;
      chatImage?: string;
      admins?: string[];
      members?: string[];
    },
    adminId: string
  ): Promise<T>;
  addMembersToGroup(
    chatData: {
      cid: string;
      members: string[];
    },
    adminId: string
  ): Promise<T>;
  removeMembersFromGroup(
    chatData: {
      cid: string;
      members: string[];
    },
    adminId: string
  ): Promise<T>;
  addAdminsToGroup(
    chatData: {
      cid: string;
      admins: string[];
    },
    adminId: string
  ): Promise<T>;
  removeAdminsFromGroup(
    chatData: {
      cid: string;
      admins: string[];
    },
    adminId: string
  ): Promise<T>;
  deleteGroup(chatData: { cid: string; adminId: string }): Promise<T>;
  // exitGroup(cid: string, userId: string): Promise<Chat>;
  // checkIfUserIsAdmin(
  //   cid: string,
  //   userId: string
  // ): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // } | null>;
  // postAdmins(chatData: { cid: string; userIds: string[] }): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // }>;
  // deleteAdmins(chatData: { cid: string; userIds: string[] }): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // }>;
}
