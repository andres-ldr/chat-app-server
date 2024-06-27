import { MsgEntity } from '../domain/Message';
import MessageRepository from '../domain/MessageRepository';

export default class MessageUseCase {
  private static instance: MessageUseCase;

  constructor(
    private readonly messageRepository: MessageRepository<MsgEntity>,
  ) {}

  public static getInstance(
    messageRepository: MessageRepository<MsgEntity>,
  ) {
    if (!this.instance) {
      this.instance = new MessageUseCase(messageRepository);
    }
    return this.instance;
  }

  async sendMessage(message: MsgEntity) {
    const messageCreated = await this.messageRepository.postMessage(message);
    return messageCreated;
  }

  async getMessages(chatId: string) {
    const messages = await this.messageRepository.getMessages(chatId);
    return messages;
  }

  async editMessage(message: MsgEntity) {
    return await this.messageRepository.editMessage(message);
  }

  async deleteMessage(mid: string) {
    return await this.messageRepository.deleteMessage(mid);
  }
}
