import { ChatEntity } from './chat.entity';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import MsgDTO from './MsgDTO';

enum CHAT_TYPE {
  GROUP,
  SIMPLE,
}

export default class ChatDTO implements ChatEntity {
  cid: string;
  messages: MsgDTO[];
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
