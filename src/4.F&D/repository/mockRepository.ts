import { UserDTO } from '../../1.EBR/UserDTO';
import UserRepository from '../../2.ABR/user.repository';

const mockUsers: UserDTO[] = [];

export default class MockUserRespository implements UserRepository {
  constructor() {}
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
