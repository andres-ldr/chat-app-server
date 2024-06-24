import { MsgEntity } from './Message';

export default interface MessageRepository {
  postMessage(
    message: MsgEntity
  ): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }>;
  getMessages(chatId: string): Promise<
    {
      mid: string;
      chatId: string;
      content: string | null;
      file: string | null;
      type: string;
      creationDate: Date;
      senderId: string;
    }[]
  >;
  editMessage(message: MsgEntity): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }>;
  deleteMessage(mid: string): Promise<{
    mid: string;
    chatId: string;
    content: string | null;
    file: string | null;
    type: string;
    creationDate: Date;
    senderId: string;
  }>;
}
