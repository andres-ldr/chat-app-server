import { UserEntity } from './User';
import { MsgEntity } from './Message';

export interface ChatEntity {
  cid: string;
  alias?: string;
  creationDate: Date;
  chatImage?: string;
  admins: UserEntity[];
  members: string[];
  messages: MsgEntity[];
  isGroup: boolean;
}
