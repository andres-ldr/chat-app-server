import { ChatEntity } from './chat.entity';
import { MsgEntity } from './msg.entity';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

enum CHAT_TYPE {
  GROUP,
  SIMPLE,
}

export default class ChatDTO implements ChatEntity {
  cid: string;
  messages: MsgEntity[];
  creation_date: string;
  type: CHAT_TYPE;
  members: string[];

  constructor({ members }: ChatEntity) {
    this.cid = uuidv4();
    this.messages = [];
    this.creation_date = moment().format('MMMM Do YYYY, h:mm:ss a');
    this.type = CHAT_TYPE.SIMPLE;
    this.members = members;
  }
}
