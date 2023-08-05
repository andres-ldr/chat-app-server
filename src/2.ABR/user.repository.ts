import ChatDTO from '../1.EBR/ChatDTO';
import { UserDTO } from '../1.EBR/UserDTO';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserDTO>;
  postNewUser(user: UserDTO): Promise<UserDTO>;
  fetchAllUsers(): Promise<UserDTO[]>;
  postNewContact(userId: string, email: string): Promise<UserDTO>;
  postNewChat(chat: ChatDTO): Promise<ChatDTO>;
}
