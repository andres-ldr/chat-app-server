import { UserEntity } from '../1.EBR/user.entity';

export default interface UserRepository {
  getUserById(uuid: string): Promise<UserEntity | null>;
  postNewUser(user: UserEntity): Promise<UserEntity | null>;
  fetchAllUsers(): Promise<UserEntity[] | []>;
}
