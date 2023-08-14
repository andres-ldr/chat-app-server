import { UserEntity } from '../1.EBR/user.entity';
import { userResponseType } from '../1.EBR/Types';
import { ChatEntity } from '../1.EBR/chat.entity';
import { MsgEntity } from '../1.EBR/msg.entity';
import ContactEntity from '../1.EBR/Contact.entity';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserEntity | null>;
  postNewUser(user: UserEntity): Promise<UserEntity>;
  fetchAllChats(userId: string): Promise<ChatEntity[] | []>;
  fetchAllContacts(uid: string): Promise<{}[]>;
  postNewContact(
    userId: string,
    alias: string,
    email: string
  ): Promise<ContactEntity>;
  postNewChat(
    alias: string | null,
    members: [],
    adminId: { uid: string }[]
  ): Promise<ChatEntity>;
  postNewMsg(
    chatId: string,
    content: string,
    type: string,
    sender: string
  ): Promise<MsgEntity>;
  fetchChatMsgs(uid: string, chatId: string): Promise<MsgEntity[] | []>;
  userExists(uid: string): Promise<UserEntity>;
  emailExists(email: string): Promise<UserEntity | null>;
  contactExists(authorId: string, email: string): Promise<{} | null>;
  lookUpForExistingChat(alias: string, participants: []): Promise<void>;
  authenticateUser(email: string, password: string): Promise<UserEntity>;
}
