import { UserEntity } from './User';

export default interface UserRepository<T extends UserEntity> {
  postNewUser(user: T): Promise<T>;
  getUserById(uid: string): Promise<T | null>;
  getUserByEmail(email: string): Promise<T | null>;
  getUsersByName(name: string): Promise<T[]>;
  getUsersByEmail(email: string): Promise<T[]>;
  updateUser(uid: string, user: T): Promise<T>;
  deleteUser(uid: string): Promise<T>;
  userExists(email: string): Promise<T | null>;
  getMembersOfAChat(cid: string): Promise<T[]>;
  getAdminsOfAGroupChat(cid: string): Promise<T[]>;
}
