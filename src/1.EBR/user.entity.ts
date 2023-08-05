import { ChatEntity } from './chat.entity';

export interface UserEntity {
  name: string;
  last_name: string;
  email: string;
  contacts: string[];
  profile_image: string;
  chats: ChatEntity[];
  creation_date: string;
}
