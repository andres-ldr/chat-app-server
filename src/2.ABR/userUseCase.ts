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
  public async findUserById() {}

  public async getAllUsers() {
    const allUsers = this.userRepository.fetchAllUsers();
    return allUsers;
  }
}
