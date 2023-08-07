import { QueryResult } from 'pg';
import ChatDTO from '../1.EBR/ChatDTO';
import MsgDTO from '../1.EBR/MsgDTO';
import { UserDTO } from '../1.EBR/UserDTO';

export default interface UserRepository {
  getUserById(uuid: string): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null>;
  postNewUser(user: UserDTO): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null>;
  fetchAllUsers(): Promise<
    | {
        uid: string;
        name: string;
        last_name: string;
        email: string;
        profile_image: string;
        creation_date: Date;
      }[]
    | null
  >;
  postNewContact(
    userId: string,
    email: string
  ): Promise<{
    uid: string;
    name: string;
    last_name: string;
    email: string;
    profile_image: string;
    creation_date: Date;
  } | null>;
  postNewChat(chat: ChatDTO): Promise<ChatDTO>;
  postNewMsg(msg: MsgDTO, chatId: string): Promise<MsgDTO>;
  fetchChatMsgs(chatId: string): Promise<MsgDTO[]>;
}
