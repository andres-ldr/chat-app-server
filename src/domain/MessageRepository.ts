import { MsgEntity } from './Message';

export default interface MessageRepository {
  postMessage(message: MsgEntity): Promise<MsgEntity>;
  getMessages(chatId: string): Promise<MsgEntity[]>;
  editMessage(message: MsgEntity): Promise<MsgEntity>;
  deleteMessage(mid: string): Promise<MsgEntity>;
}
