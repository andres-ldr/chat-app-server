import { PrismaClient } from '@prisma/client';
import ContactRepository, {
  ContactCreateType,
} from '../../domain/ContactRepository';
import { ContactEntity } from '../../domain/Contact';

export default class PostgresContactRepository implements ContactRepository {
  private static instance: PostgresContactRepository;

  constructor(readonly prisma: PrismaClient) {}

  async getContactById(
    authorId: string,
    contactId: string
  ): Promise<ReturnType<typeof this.prisma.contact.findUnique>> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        contactId,
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
  ): Promise<ReturnType<typeof this.prisma.contact.findFirst>> {
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
  ): Promise<ReturnType<typeof this.prisma.contact.update>> {
    const updatedContact = await this.prisma.contact.update({
      where: {
        contactId: contact.contactId,
        authorId,
      },
      data: {
        alias: contact.alias,
        email: contact.email,
        // user: {
        //   connect: {
        //     uid: contact.userId,
        //   },
        // },
        // author: {
        //   connect: {
        //     uid: authorId,
        //   },
        // },
      },
    });
    return updatedContact;
  }

  async getContacts(
    authorId: string
  ): Promise<ReturnType<typeof this.prisma.contact.findMany>> {
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
  }): Promise<ContactCreateType> {
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
    });
    return newContact;
  }

  async deleteContact(
    authorId: string,
    contactId: string
  ): Promise<ReturnType<typeof this.prisma.contact.delete>> {
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
