import { UserEntity } from './user.entity';

export type userSimpleData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
};

export type userResponseType = UserEntity | null;
