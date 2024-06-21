import { PrismaClient } from '@prisma/client';
import ContactRepository from '../../domain/ContactRepository';
import ContactEntity from '../../domain/Contact';
import { UserEntity } from '../../domain/User';
import Contact from '../../domain/Contact';

export default class PostgresContactRepository implements ContactRepository {
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  // async getContactById(authorId: string, contactId: string): Promise<any> {
  //   return await this.prisma.contact.findUnique({
  //     where: {
  //       authorId,
  //       contactId,
  //     },
  //   });
  // }

  async getContactById(
    authorId: string,
    contactId: string
  ): Promise<Contact | null> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          authorId,
          contactId,
        },
      });
      return contact;
    } catch (error) {
      console.error('Failed to retrieve contact by ID:', error);
      throw new Error('Error retrieving contact');
    }
  }

  async getContactByEmail(authorId: string, email: string): Promise<any> {
    return this.prisma.contact.findFirst({
      where: {
        authorId,
        user: {
          email,
        },
      },
    });
  }

  async updateContact(authorId: string, contact: ContactEntity): Promise<any> {
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
