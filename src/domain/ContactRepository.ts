import { ContactEntity, Contact } from './Contact';

export default interface ContactRepository {
  createContact(contact: {
    alias: string;
    email: string;
    authorId: string;
  }): Promise<Contact>;
  getContacts(authorId: string): Promise<Contact[]>;
  getContactById(contactId: string, authorId: string): Promise<Contact | null>;
  getContactByEmail(authorId: string, email: string): Promise<Contact | null>;
  updateContact(authorId: string, contact: ContactEntity): Promise<Contact>;
  deleteContact(authorId: string, contactId: string): Promise<Contact>;
}
