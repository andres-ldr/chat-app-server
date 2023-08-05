import { MsgEntity } from './msg.entity';

export interface ChatEntity {
  messages: MsgEntity[];
  members: string[];
}
