import ContactEntity from './Contact';

export default interface ContactRepository {
  createContact(contact: any): Promise<ContactEntity | null>;
  getContacts(authorId: string): Promise<any[]>;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<ContactEntity | null>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<ContactEntity | null>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<ContactEntity | null>;
  deleteContact(authorId: string, contactId: string): Promise<any>;
}
