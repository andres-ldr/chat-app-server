import { UserEntity } from '../../1.EBR/user.entity';
import UserRepository from '../../2.ABR/user.repository';

const mockUsers: UserEntity[] = [];

export default class MockUserRespository implements UserRepository {
  constructor() {}

  async getUserById(uuid: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  async postNewUser(newUser: UserEntity): Promise<UserEntity | null> {
    console.log(mockUsers);
    mockUsers.push(newUser);
    return newUser;
  }
  async fetchAllUsers(): Promise<UserEntity[] | []> {
    return mockUsers;
  }
}
