import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export type userSimpleData = {
  name: string;
  last_name: string;
  email: string;
  profile_image: string;
};

export class UserDTO implements UserEntity {
  uid: string;
  name: string;
  last_name: string;
  email: string;
  contacts: string[];
  profile_image: string;
  chats: string[];
  creation_date: string;

  constructor({ name, last_name, email, profile_image }: userSimpleData) {
    this.uid = uuidv4();
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.contacts = [];
    this.profile_image = profile_image;
    this.chats = [];
    this.creation_date = moment().format('MMMM Do YYYY, h:mm:ss a');
  }
}
