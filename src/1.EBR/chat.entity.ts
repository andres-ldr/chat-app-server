import { MsgEntity } from './msg.entity';

export interface ChatEntity {
  cid: string;
  alias: string | null;
  creationDate: Date;
}
