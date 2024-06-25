import { ContactEntity } from './Contact';
import prismaClient from '../infrastructure/config/prisma-client';

const prisma = prismaClient.getInstance();

export type ContactCreateType = ReturnType<typeof prisma.contact.create>;

export default interface ContactRepository {
  createContact(contact: {
    alias: string;
    email: string;
    authorId: string;
  }): Promise<ContactCreateType>;
  getContacts(
    authorId: string
  ): Promise<ReturnType<typeof prisma.contact.findMany>>;
  getContactById(
    contactId: string,
    authorId: string
  ): Promise<ReturnType<typeof prisma.contact.findUnique>>;
  getContactByEmail(
    authorId: string,
    email: string
  ): Promise<ReturnType<typeof prisma.contact.findFirst>>;
  updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<ReturnType<typeof prisma.contact.findFirst>>;
  deleteContact(
    authorId: string,
    contactId: string
  ): Promise<ReturnType<typeof prisma.contact.delete>>;
}
