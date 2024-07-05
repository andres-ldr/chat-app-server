import { ContactEntity } from '../domain/Contact';
import ContactRepository from '../domain/ContactRepository';

export default class ContactUseCases {
  private static instance: ContactUseCases;

  constructor(
    private readonly contactRepository: ContactRepository<ContactEntity>
  ) {}

  async createContact(contact: {
    email: string;
    authorId: string;
    alias: string;
  }) {
    const contactExists = await this.contactRepository.contactExists(
      contact.authorId,
      contact.email
    );
    // Check if emails exist?
    if (contactExists) throw new Error('Contact already exists');
    const newContact = await this.contactRepository.createContact(contact);
    return newContact;
  }

  async getContacts(authorId: string) {
    const contacts = await this.contactRepository.getContacts(authorId);
    return contacts;
  }

  async getContactById(authorId: string, contactId: string) {
    const contact = await this.contactRepository.getContactById(
      authorId,
      contactId
    );
    if (!contact) throw new Error('Contact not found');

    return contact;
  }

  async getContactByEmail(authorId: string, email: string) {
    const contact = await this.contactRepository.getContactByEmail(
      authorId,
      email
    );
    if (!contact) throw new Error('Contact not found');
    return contact;
  }

  async updateContact(authorId: string, contact: ContactEntity) {
    // // const user = await this.userRepository.getUserByEmail(contact.email);
    // // if (!user) return null;
    // contact.userId = user.uid;
    const updatedContact = await this.contactRepository.updateContact(
      authorId,
      contact
    );

    return updatedContact;
  }

  async deleteContact(authorId: string, contactId: string) {
    return this.contactRepository.deleteContact(authorId, contactId);
  }

  public static getInstance(
    contactRepository: ContactRepository<ContactEntity>
  ) {
    if (!this.instance) {
      this.instance = new ContactUseCases(contactRepository);
    }

    return this.instance;
  }
}
