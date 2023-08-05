import ChatDTO from '../../1.EBR/ChatDTO';
import MsgDTO from '../../1.EBR/MsgDTO';
import { UserDTO } from '../../1.EBR/UserDTO';
import { ChatEntity } from '../../1.EBR/chat.entity';
import UserRepository from '../../2.ABR/user.repository';

const mockUsers: UserDTO[] = [];
const mockChats: ChatDTO[] = [];
export default class MockUserRespository implements UserRepository {
  constructor() {}
  async fetchChatMsgs(chatId: string): Promise<MsgDTO[]> {
    let chat;
    let msgs;
    try {
      chat = mockChats.find((chat) => chat.cid === chatId);
      if (chat === undefined || chat === null) {
        throw new Error();
      }
      msgs = chat.messages;
    } catch (err) {
      throw new Error();
    }
    return msgs;
  }
  async postNewMsg(msg: MsgDTO, cid: string): Promise<MsgDTO> {
    try {
      const chat = mockChats.find((chat) => chat.cid === cid);
      if (chat === undefined || chat === null) {
        throw new Error();
      }
      chat.messages.push(msg);
    } catch (err) {
      throw new Error();
    }
    return msg;
  }
  async postNewChat(chat: ChatDTO): Promise<ChatDTO> {
    try {
      mockChats.push(chat);
      chat.members.map(async (memberId) => {
        const member = await this.getUserById(memberId);
        member.chats.push(chat.cid);
      });
    } catch (err) {
      throw new Error();
    }
    return chat;
  }
  async postNewContact(userId: string, email: string): Promise<UserDTO> {
    let contact: UserDTO | undefined;
    let user: UserDTO | undefined;
    try {
      contact = await mockUsers.find((e) => e.email === email);
      if (contact === undefined) {
        throw new Error();
      }
    } catch (err) {
      throw new Error();
    }
    user = await this.getUserById(userId);
    try {
      user.contacts.push(contact.uid);
    } catch (err) {
      throw new Error();
    }
    return user;
  }

  async getUserById(id: string): Promise<UserDTO> {
    let user: UserDTO | undefined;
    try {
      user = await mockUsers.find((e) => e.uid === id);
      if (user === undefined || !user) {
        throw Error();
      }
    } catch (err) {
      throw new Error();
    }
    return user;
  }
  async postNewUser(newUser: UserDTO): Promise<UserDTO> {
    try {
      mockUsers.push(newUser);
    } catch (err) {
      throw new Error();
    }
    return newUser;
  }
  async fetchAllUsers(): Promise<UserDTO[]> {
    let allUsers: UserDTO[];
    try {
      allUsers = Array.from(mockUsers);
    } catch (err) {
      throw new Error();
    }
    return allUsers;
  }
}
