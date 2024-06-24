import ContactEntity from './Contact';
import { UserEntity } from './User';

export default interface ContactRepository {
  createContact(contact: {
    alias: string;
    email: string;
    user: UserEntity;
    authorId: string;
  }): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  }>;
  getContacts(authorId: string): Promise<
    {
      contactId: string;
      email: string;
      userId: string;
      authorId: string;
      alias: string;
      creationDate: Date;
    }[]
  >;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  } | null>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  } | null>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  }>;
  deleteContact(
    authorId: string,
    contactId: string
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  }>;
}
