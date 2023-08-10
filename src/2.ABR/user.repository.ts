import { QueryResult } from 'pg';
import ChatDTO from '../1.EBR/ChatDTO';
import MsgDTO from '../1.EBR/MsgDTO';
import { UserEntity } from '../1.EBR/user.entity';
import { userResponseType } from '../1.EBR/UserDTO';
import { ChatEntity } from '../1.EBR/chat.entity';
import { MsgEntity } from '../1.EBR/msg.entity';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserEntity | null>;
  postNewUser(user: UserEntity): Promise<userResponseType>;
  fetchAllChats(userId: string): Promise<ChatEntity[] | []>;
  fetchAllContacts(uid: string): Promise<{}[]>;
  postNewContact(
    userId: string,
    alias: string,
    email: string
  ): Promise<{ email: string; authorId: string; alias: string } | null>;
  postNewChat(alias: string, members: []): Promise<ChatEntity | null>;
  postNewMsg(
    chatId: string,
    content: string,
    type: string,
    sender: string
  ): Promise<MsgEntity | null>;
  fetchChatMsgs(uid: string, chatId: string): Promise<MsgEntity[] | []>;
}
