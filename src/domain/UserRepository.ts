import ContactEntity from './Contact';
import { ChatEntity } from './Chat';
import { MsgEntity } from './Message';
import { UserEntity } from './User';
import Singleton from '../Utils/Singleton';

export default interface UserRepository {
  postNewUser(user: UserEntity): Promise<UserEntity>;
  getUserById(uid: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getUsersByName(name: string): Promise<UserEntity[]>;
  getUsersByEmail(email: string): Promise<UserEntity[]>;
  updateUser(uid: string, user: UserEntity): Promise<UserEntity>;
  deleteUser(uid: string): Promise<UserEntity>;
  userExists(uid: string): Promise<UserEntity>;
  getMembersOfAChat(cid: string): Promise<UserEntity[]>;
  getAdminsOfAGroupChat(cid: string): Promise<UserEntity[]>;
  // postMessage(msg: MsgEntity): Promise<MsgEntity | null>;
  // fetchAllChats(uid: string): Promise<ChatEntity[] | []>;
  // findTheOtherMemberOfAChat(cid: string, uid: string): Promise<UserEntity>;
  // findUsersContactByEmail(uid: string, email: string): Promise<any>;
  // fetchAllContacts(uid: string): Promise<{}[]>;
  // postNewContact(userId: string, alias: string, email: string): Promise<{}>; //ContactEntity
  // postNewChat(
  //   alias: string | null,
  //   members: [],
  //   adminId: { uid: string }[],
  //   chatImage: string | null
  // ): Promise<ChatEntity>;
  // postNewMsg(
  //   chatId: string,
  //   content: string,
  //   type: string,
  //   sender: string
  // ): Promise<MsgEntity>;
  // fetchChatById(uid: string, cid: string): Promise<ChatEntity>;

  // emailExists(email: string): Promise<UserEntity | null>;
  // contactExists(authorId: string, email: string): Promise<{} | null>;
  // findChatByMembers(
  //   alias: string | null,
  //   members: { email: string }[]
  // ): Promise<ChatEntity | null>;
  // fetchChatMsgs(cid: string): Promise<MsgEntity[]>;
  // fetchChatMembers(cid: string): Promise<UserEntity[]>;
  // isAnUserContact(uid: string, email: string): Promise<ContactEntity | null>;
}
