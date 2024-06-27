import { ContactEntity } from './Contact';
import { UserEntity } from './User';

export default interface ContactRepository<T extends ContactEntity> {
  createContact(contact: {
    alias: string;
    email: string;
    authorId: string;
  }): Promise<T>;
  getContacts(authorId: string): Promise<(T & Partial<UserEntity>)[] | null>;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<(T & Partial<UserEntity>) | null>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<(T & Partial<UserEntity>) | null>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<(T & Partial<UserEntity>) | null>;
  deleteContact(authorId: string, contactId: string): Promise<T>;
  contactExists(authorId: string, email: string): Promise<T | null>;
}
