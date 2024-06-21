import { PrismaClient } from '@prisma/client';
import ContactRepository from '../../domain/ContactRepository';
import ContactEntity from '../../domain/Contact';

export default class PostgresContactRepository implements ContactRepository {
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  async getContactById(
    authorId: string,
    contactId: string
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null> {
    return await this.prisma.contact.findUnique({
      where: {
        authorId,
        contactId,
      },
    });
  }

  async getContactByEmail(
    authorId: string,
    email: string
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null> {
    return this.prisma.contact.findFirst({
      where: {
        authorId,
        user: {
          email,
        },
      },
    });
  }

  async updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null> {
    return await this.prisma.contact.update({
      where: {
        contactId: contact.contactId,
      },
      data: {
        alias: contact.alias,
        email: contact.email,
        user: {
          connect: {
            uid: contact.userId,
          },
        },
        author: {
          connect: {
            uid: authorId,
          },
        },
      },
    });
  }

  async getContacts(authorId: string): Promise<any[]> {
    return await this.prisma.contact.findMany({
      where: {
        authorId,
      },
    });
  }

  async createContact(contact: any): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null> {
    const newContact = await this.prisma.contact.create({
      data: {
        alias: contact.alias,
        email: contact.email,
        user: {
          connect: {
            uid: contact.user.uid,
          },
        }, // Add the 'user' property
        author: {
          connect: {
            uid: contact.authorId,
          },
        }, // Add the 'author' property
      },
    });
    return newContact;
  }

  async deleteContact(
    authorId: string,
    contactId: string
  ): Promise<{
    contactId: string;
    email: string;
    authorId: string;
    alias: string;
    profileImage?: string;
  } | null> {
    return await this.prisma.contact.delete({
      where: {
        contactId,
        // authorId,
      },
    });
  }

  static getInstance(prisma: PrismaClient): PostgresContactRepository {
    if (!PostgresContactRepository.instance) {
      PostgresContactRepository.instance = new PostgresContactRepository(
        prisma
      );
    }
    return PostgresContactRepository.instance;
  }
}
