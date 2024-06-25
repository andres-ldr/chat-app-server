import { MsgEntity } from '../domain/Message';
import MessageRepository from '../domain/MessageRepository';
import UserRepository from '../domain/UserRepository';

export default class MessageUseCase {
  private static instance: MessageUseCase;

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository
  ) {}

  public static getInstance(
    messageRepository: MessageRepository,
    userRepository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new MessageUseCase(messageRepository, userRepository);
    }
    return this.instance;
  }

  async sendMessage(message: MsgEntity) {
    const messageCreated = await this.messageRepository.postMessage(message);

    if (!messageCreated) throw new Error('Message not sent');
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
