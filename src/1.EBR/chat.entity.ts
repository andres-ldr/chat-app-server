import { MsgEntity } from './msg.entity';

enum CHAT_TYPE {
  GROUP,
  NORMAL,
}

export interface ChatEntity {
  messages: MsgEntity[];
  creation_date: string;
  type: CHAT_TYPE;
}
