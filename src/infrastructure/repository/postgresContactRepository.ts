import { PrismaClient } from '@prisma/client';
import ContactRepository from '../../domain/ContactRepository';
import { ContactEntity } from '../../domain/Contact';
import { Contact } from '@prisma/client';
import { UserEntity } from '../../domain/User';

export default class PostgresContactRepository
  implements ContactRepository<Contact>
{
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  async contactExists(
    authorId: string,
    email: string
  ): Promise<Contact | null> {
    return await this.prisma.contact.findFirst({
      where: {
        authorId,
        email,
      },
    });
  }

  async getContactById(
    authorId: string,
    contactId: string
  ): Promise<(Contact & Partial<UserEntity>) | null> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        contactId,
        authorId,
      },
      include: {
        user: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
    return contact;
  }

  async getContactByEmail(
    authorId: string,
    email: string
  ): Promise<(Contact & Partial<UserEntity>) | null> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        authorId,
        email,
      },
      include: {
        user: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
    return contact;
  }

  async updateContact(
    authorId: string,
    contact: ContactEntity
  ): Promise<(Contact & Partial<UserEntity>) | null> {
    const updatedContact = await this.prisma.contact.update({
      where: {
        contactId: contact.contactId,
        authorId,
      },
      data: {
        alias: contact.alias,
        email: contact.email,
      },
      include: {
        user: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
    return updatedContact;
  }

  async getContacts(
    authorId: string
  ): Promise<(Contact & Partial<UserEntity>)[] | null> {
    return await this.prisma.contact.findMany({
      where: {
        authorId,
      },
      include: {
        user: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async createContact(contact: {
    email: string;
    authorId: string;
    alias: string;
  }): Promise<Contact & Partial<UserEntity>> {
    const newContact = await this.prisma.contact.create({
      data: {
        alias: contact.alias,
        email: contact.email,
        user: {
          connect: {
            email: contact.email,
          },
        },
        author: {
          connect: {
            uid: contact.authorId,
          },
        },
      },
      include: {
        user: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
    return newContact;
  }

  async deleteContact(authorId: string, contactId: string): Promise<Contact> {
    const deletedContact = await this.prisma.contact.delete({
      where: {
        contactId,
        authorId,
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
