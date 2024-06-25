import { UserEntity } from './User';
import { MsgEntity } from './Message';

export interface Chat {
  cid: string;
  alias: string | null;
  creationDate: Date;
  chatImage: string | null;
  isGroup: boolean;
}

export interface ChatEntity {
  cid: string;
  alias?: string;
  creationDate: Date;
  chatImage?: string;
  isGroup: boolean;
  admins: UserEntity[];
  members: UserEntity[];
  messages: MsgEntity[];
}
