import { ChatEntity } from './chat.entity';

export interface UserEntity {
  name: string;
  last_name: string;
  email: string;
  contacts: [];
  profile_image: string;
  chats: [];
  creation_date: string;
}
