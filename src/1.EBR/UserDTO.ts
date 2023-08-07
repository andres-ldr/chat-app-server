import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export type userSimpleData = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  profile_image: string;
};

export class UserDTO implements UserEntity {
  uid: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  contacts: [];
  profile_image: string;
  chats: [];
  creation_date: string;

  constructor({
    name,
    last_name,
    email,
    password,
    profile_image,
  }: userSimpleData) {
    this.uid = '';
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.contacts = [];
    this.profile_image = profile_image;
    this.chats = [];
    this.creation_date = moment().format();
  }
}
