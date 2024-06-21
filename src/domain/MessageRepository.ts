import { MsgEntity } from './Message';

export default interface MessageRepository {
  postMessage(message: MsgEntity): Promise<any>;
  getMessages(chatId: string): Promise<MsgEntity[]>;
  editMessage(message: MsgEntity): Promise<any>;
  deleteMessage(mid: string): Promise<any>;
}
