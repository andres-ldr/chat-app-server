import ContactEntity from '../domain/Contact';
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
    // find user by email
    const user = await this.userRepository.getUserByEmail(contact.email);
    if (!user) return null;
    const newContact = {
      ...contact,
      user,
    };
    // TODO: CHECK IF CONTACT ALREADY EXISTS
    return this.contactRepository.createContact(newContact);
  }

  async getContacts(authorId: string) {
    const contacts = await this.contactRepository.getContacts(authorId);
    const contactsWithUser = Promise.all(
      contacts.map(async (contact) => {
        const user = await this.userRepository.getUserById(contact.userId);
        return {
          ...contact,
          user,
        };
      })
    );

    return contactsWithUser;
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
    if (!contact) return null;
    const user = await this.userRepository.getUserById(contact!.userId);
    const contactWithUser = {
      ...contact,
      user,
    };
    return contactWithUser;
  }

  async updateContact(authorId: string, contact: ContactEntity) {
    const user = await this.userRepository.getUserByEmail(contact.email);
    if (!user) return null;
    contact.userId = user.uid;
    return this.contactRepository.updateContact(authorId, contact);
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
