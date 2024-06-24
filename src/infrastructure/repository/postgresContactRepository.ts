import { PrismaClient } from '@prisma/client';
import ContactRepository from '../../domain/ContactRepository';
import ContactEntity from '../../domain/Contact';
import { UserEntity } from '../../domain/User';

export default class PostgresContactRepository implements ContactRepository {
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  async getContactById(
    authorId: string,
    contactId: string
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  } | null> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        authorId,
        contactId,
      },
    });
    return contact;
  }

  async getContactByEmail(
    authorId: string,
    email: string
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  } | null> {
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

  async updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<{
    contactId: string;
    email: string;
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  }> {
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

  async getContacts(authorId: string): Promise<
    {
      contactId: string;
      email: string;
      userId: string;
      authorId: string;
      alias: string;
      creationDate: Date;
    }[]
  > {
    return await this.prisma.contact.findMany({
      where: {
        authorId,
      },
    });
  }

  async createContact(contact: {
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
  }> {
    const newContact = await this.prisma.contact.create({
      data: {
        alias: contact.alias,
        email: contact.email,
        user: {
          connect: {
            uid: contact.user.uid,
          },
        },
        author: {
          connect: {
            uid: contact.authorId,
          },
        },
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
    userId: string;
    authorId: string;
    alias: string;
    creationDate: Date;
  }> {
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
