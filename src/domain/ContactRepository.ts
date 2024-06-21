import ContactEntity from './Contact';

export default interface ContactRepository {
  createContact(contact: any): Promise<any>;
  getContacts(authorId: string): Promise<any[]>;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<any>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<any>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<any>;
  deleteContact(authorId: string, contactId: string): Promise<any>;
}
