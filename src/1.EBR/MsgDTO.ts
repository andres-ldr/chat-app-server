import { MSG_TYPE, MsgEntity } from './msg.entity';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default class MsgDTO implements MsgEntity {
  mid: string;
  type: MSG_TYPE;
  content: string;
  creation_date: string;
  sender: string;

  constructor({ content, sender, type }: MsgEntity) {
    this.mid = uuidv4();
    this.content = content;
    this.sender = sender;
    this.type = type;
    this.creation_date = moment().format('MMMM Do YYYY, h:mm:ss a');
  }
}
