import ContactEntity from '../enterprise/Contact.entity';
import { ChatEntity } from '../enterprise/chat.entity';
import { MsgEntity } from '../enterprise/msg.entity';
import { UserEntity } from '../enterprise/user.entity';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserEntity | null>;
  postNewUser(user: UserEntity): Promise<UserEntity>;
  fetchAllChats(uid: string): Promise<ChatEntity[] | []>;
  findTheOtherMemberOfAChat(cid: string, uid: string): Promise<UserEntity>;
  findUsersContactByEmail(uid: string, email: string): Promise<any>;
  fetchAllContacts(uid: string): Promise<{}[]>;
  postNewContact(userId: string, alias: string, email: string): Promise<{}>; //ContactEntity
  postNewChat(
    alias: string | null,
    members: [],
    adminId: { uid: string }[],
    chatImage: string | null
  ): Promise<ChatEntity>;
  postNewMsg(
    chatId: string,
    content: string,
    type: string,
    sender: string
  ): Promise<MsgEntity>;
  fetchChatById(uid: string, cid: string): Promise<ChatEntity>;
  userExists(uid: string): Promise<UserEntity>;
  emailExists(email: string): Promise<UserEntity | null>;
  contactExists(authorId: string, email: string): Promise<{} | null>;
  findChatByMembers(
    alias: string | null,
    members: { email: string }[]
  ): Promise<ChatEntity | null>;
  fetchChatMsgs(cid: string): Promise<MsgEntity[]>;
  fetchChatMembers(cid: string): Promise<UserEntity[]>;
  isAnUserContact(uid: string, email: string): Promise<ContactEntity | null>;
}
