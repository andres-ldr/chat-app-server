import { MsgEntity } from './Message';

export default interface MessageRepository<T extends MsgEntity> {
  postMessage(message: MsgEntity): Promise<T>;
  getMessages(chatId: string): Promise<T[]>;
  editMessage(message: MsgEntity): Promise<T>;
  deleteMessage(mid: string): Promise<T>;
}
