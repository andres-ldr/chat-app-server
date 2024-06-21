import { PrismaClient } from '@prisma/client';
import ContactRepository from '../../domain/ContactRepository';
import ContactEntity from '../../domain/Contact';

export default class PostgresContactRepository implements ContactRepository {
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  async getContactById(authorId: string, contactId: string): Promise<any> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        authorId,
        contactId,
      },
    });
    return contact;
  }

  async getContactByEmail(authorId: string, email: string): Promise<any> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        authorId,
        user: {
          email,
        },
      },
    });
    return contact;
  }

  async updateContact(authorId: string, contact: ContactEntity): Promise<any> {
    const updatedContact = await this.prisma.contact.update({
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
    return updatedContact;
  }

  async getContacts(authorId: string): Promise<any[]> {
    return await this.prisma.contact.findMany({
      where: {
        authorId,
      },
    });
  }

  async createContact(contact: any): Promise<any> {
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

  async deleteContact(authorId: string, contactId: string): Promise<any> {
    const deletedContact = await this.prisma.contact.delete({
      where: {
        contactId,
        // authorId,
      },
    });
    return deletedContact;
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
