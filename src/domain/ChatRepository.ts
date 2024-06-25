import prismaClient from '../infrastructure/config/prisma-client';
import { Chat } from './Chat';

const prisma = prismaClient.getInstance();

export type ChatCreateType = ReturnType<typeof prisma.chat.create>;

export default interface ChatRepository {
  getChatById(id: string): Promise<Chat | null>;
  getChats(userId: string): Promise<Chat[]>;
  getChatByMembers(members: string[]): Promise<Chat | null>;
  deleteChat(cid: string, uid: string): Promise<Chat>;
  postNewChat(members: string[]): Promise<Chat>;
  postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
  }): Promise<ChatCreateType>;
  updateGroup(
    chatData: {
      cid: string;
      alias: string;
      chatImage: string | null;
      admins: string[];
      members: string[];
    },
    adminId: string
  ): Promise<Chat>;
  // addMembersToGroup(chatData: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }): Promise<Chat>;
  // removeMembersFromGroup(chatData: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }): Promise<Chat>;
  deleteGroup(chatData: { cid: string; adminId: string }): Promise<Chat>;
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
