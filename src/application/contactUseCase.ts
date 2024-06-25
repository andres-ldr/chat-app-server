import { ContactEntity } from '../domain/Contact';
import ContactRepository from '../domain/ContactRepository';
import UserRepository from '../domain/UserRepository';

export default class ContactUseCases {
  private static instance: ContactUseCases;

  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createContact(contact: {
    email: string;
    authorId: string;
    alias: string;
  }) {
    const newContact = await this.contactRepository.createContact(contact);
    if (!newContact) throw new Error('Error creating contact');
    console.log(newContact);
    return { messsage: 'Contact created successfully' };
  }

  async getContacts(authorId: string) {
    const contacts = await this.contactRepository.getContacts(authorId);

    console.log(contacts);

    return contacts;
  }

  async getContactById(authorId: string, contactId: string) {
    const contact = await this.contactRepository.getContactById(
      authorId,
      contactId
    );
    if (!contact) return null;
    const user = await this.userRepository.getUserById(contact!.userId);
    const contactWithUser = {
      ...contact,
      user,
    };
    return contactWithUser;
  }

  async getContactByEmail(authorId: string, email: string) {
    const contact = await this.contactRepository.getContactByEmail(
      authorId,
      email
    );
    return contact;
  }

  async updateContact(authorId: string, contact: ContactEntity) {
    const user = await this.userRepository.getUserByEmail(contact.email);
    if (!user) return null;
    contact.userId = user.uid;
    const updatedContact =await this.contactRepository.updateContact(authorId, contact);
    console.log(updatedContact);
    if (!updatedContact) throw new Error('Error updating contact');
    return { message: 'Contact updated successfully' };
    
  }

  async deleteContact(authorId: string, contactId: string) {
    return this.contactRepository.deleteContact(authorId, contactId);
  }

  public static getInstance(
    contactRepository: ContactRepository,
    userRepository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new ContactUseCases(contactRepository, userRepository);
    }

    return this.instance;
  }
}
