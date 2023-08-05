import { UserDTO, userSimpleData } from '../1.EBR/UserDTO';
import UserRepository from './user.repository';

export default class UserUsesCases {
  constructor(private readonly userRepository: UserRepository) {}

  public async addNewUser({
    name,
    last_name,
    email,
    profile_image,
  }: userSimpleData) {
    const userValue = new UserDTO({ name, last_name, email, profile_image });
    const userCreated = await this.userRepository.postNewUser(userValue);
    return userCreated;
  }
  public async findUserById(id: string) {
    const resp: UserDTO = await this.userRepository.getUserById(id);
    return resp;
  }

  public async getAllUsers() {
    const allUsers: UserDTO[] = await this.userRepository.fetchAllUsers();
    return allUsers;
  }

  public async addNewContact(uid: string, email: string) {
    const message = this.userRepository.postNewContact(uid, email);
    return message;
  }
}
