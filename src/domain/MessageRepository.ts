import { Message, MsgEntity } from './Message';

export default interface MessageRepository {
  postMessage(message: MsgEntity): Promise<Message>;
  getMessages(chatId: string): Promise<
    ({
      sender: {
        uid: string;
        name: string;
        lastName: string;
        email: string;
        profileImage: string | null;
      };
    } & {
      mid: string;
      chatId: string;
      content: string | null;
      file: string | null;
      type: string;
      creationDate: Date;
      senderId: string;
    })[]
  >;
  editMessage(message: MsgEntity): Promise<Message>;
  deleteMessage(mid: string): Promise<Message>;
}
