import { ChatEntity } from './chat.entity';

export interface UserEntity {
  name: string;
  last_name: string;
  email: string;
  contacts: number[];
  profile_image: string;
  chats: ChatEntity[];
  creation_date: string;
}
