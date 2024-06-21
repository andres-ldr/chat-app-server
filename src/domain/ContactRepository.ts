import ContactEntity from './Contact';

export default interface ContactRepository {
  createContact(contact: any): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null>;
  getContacts(authorId: string): Promise<any[]>;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null>;
  deleteContact(authorId: string, contactId: string): Promise<any>;
}
