import { UserDTO } from '../1.EBR/UserDTO';
import { UserEntity } from '../1.EBR/user.entity';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserDTO>;
  postNewUser(user: UserEntity): Promise<UserDTO>;
  fetchAllUsers(): Promise<UserDTO[]>;
  postNewContact(userId: string, email: string): Promise<UserDTO>;
}
