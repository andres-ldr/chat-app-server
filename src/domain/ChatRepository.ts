import { ChatEntity } from './Chat';
import { UserEntity } from './User';

export default interface ChatRepository {
  getChatById(id: string): Promise<any | null>;
  getChats(userId: string): Promise<any[] | null>;
  getChatByMembers(chats: string): Promise<any | null>;
  deleteChat(cid: string, uid: string): Promise<any>;
  postNewChat(members: any[]): Promise<any>;
  postNewGroup(chatData: any): Promise<any>;
  updateGroup(chatData: any): Promise<any>;
  addMembersToGroup(chatData: any): Promise<any>;
  removeMembersFromGroup(chatData: any): Promise<any>;
  deleteGroup(chatData: { cid: string; adminId: string }): Promise<any>;
  exitGroup(chatData: { cid: string; userId: string }): Promise<any>;
  checkIfUserIsAdmin(cid: string, userId: string): Promise<any>;
  postAdmins(chatData: { cid: string; userIds: string[] }): Promise<any>;
  deleteAdmins(chatData: { cid: string; userIds: string[] }): Promise<any>;
}
