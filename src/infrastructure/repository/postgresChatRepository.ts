import { Chat, Message, PrismaClient, User } from '@prisma/client';
import ChatRepository, { ChatDetails } from '../../domain/ChatRepository';

export default class PostgresChatRepository
  implements ChatRepository<Chat, User, Message>
{
  private static instance: PostgresChatRepository;
  constructor(private readonly prisma: PrismaClient) {}

  async addAdminsToGroup(
    chatData: { cid: string; admins: string[] },
    adminId: string
  ): Promise<Chat> {
    return await this.prisma.chat.update({
      data: {
        admins: {
          connect: chatData.admins.map((e: string) => ({
            uid: e,
          })),
        },
      },
      where: {
        cid: chatData.cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
    });
  }
  async removeAdminsFromGroup(
    chatData: { cid: string; admins: string[] },
    adminId: string
  ): Promise<Chat> {
    return await this.prisma.chat.update({
      where: {
        cid: chatData.cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
      data: {
        admins: {
          disconnect: chatData.admins.map((e: string) => ({ uid: e })),
        },
      },
    });
  }

  async addMembersToGroup(
    chatData: { cid: string; members: string[] },
    adminId: string
  ): Promise<Chat> {
    return await this.prisma.chat.update({
      where: {
        cid: chatData.cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
      data: {
        members: {
          connect: chatData.members.map((e: string) => ({
            uid: e,
          })),
        },
      },
    });
  }

  async deleteGroup({
    cid,
    adminId,
  }: {
    cid: string;
    adminId: string;
  }): Promise<Chat> {
    return await this.prisma.chat.delete({
      where: {
        cid: cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
    });
  }

  async updateGroup(
    {
      cid,
      alias,
      chatImage,
    }: // admins,
    // members,
    {
      cid: string;
      alias?: string;
      chatImage?: string;
      admins?: string[];
      members?: string[];
    },
    adminId: string
  ): Promise<Chat> {
    return await this.prisma.chat.update({
      where: {
        cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
      data: {
        alias,
        chatImage,
        // admins: {
        //   connect:
        //     admins &&
        //     admins.map((e: string) => {
        //       return {
        //         uid: e,
        //       };
        //     }),
        // },
        // members: {
        //   connect:
        //     members &&
        //     members.map((e: string) => {
        //       return {
        //         uid: e,
        //       };
        //     }),
        // },
      },
    });
  }

  async removeMembersFromGroup(
    {
      cid,
      members,
    }: {
      cid: string;
      members: string[];
    },
    adminId: string
  ): Promise<Chat> {
    return await this.prisma.chat.update({
      where: {
        cid: cid,
        admins: {
          some: {
            uid: adminId,
          },
        },
      },
      data: {
        members: {
          disconnect: members.map((e: string) => ({ uid: e })),
        },
      },
    });
  }

  async postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
  }): Promise<
    Chat & {
      members: Partial<User>[];
      admins: Partial<User>[];
    }
  > {
    const newGroup = await this.prisma.chat.create({
      data: {
        alias: chatData.alias,
        chatImage: chatData.chatImage,
        isGroup: true,
        admins: {
          connect: chatData.admins.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
        members: {
          connect: chatData.members.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
      include: {
        members: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        admins: {
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

    return newGroup;
  }

  async deleteChat(cid: string, uid: string): Promise<Chat> {
    return await this.prisma.chat.delete({
      where: {
        cid: cid,
        members: {
          some: {
            uid: uid,
          },
        },
      },
    });
  }

  async getChatByMembers(
    members: string[]
  ): Promise<ChatDetails<Chat, User, Message>> {
    return this.prisma.chat.findFirst({
      where: {
        members: {
          every: {
            uid: {
              in: members,
            },
          },
        },
      },
      include: {
        members: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        admins: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        messages: {
          select: {
            mid: true,
            content: true,
            sender: true,
            creationDate: true,
          },
          orderBy: {
            creationDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getChatById(id: string): Promise<ChatDetails<Chat, User, Message>> {
    return this.prisma.chat.findUnique({
      where: {
        cid: id,
      },
      include: {
        members: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        admins: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        messages: {
          select: {
            mid: true,
            content: true,
            sender: true,
            creationDate: true,
          },
          orderBy: {
            creationDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getChats(userId: string): Promise<ChatDetails<Chat, User, Message>[]> {
    return await this.prisma.chat.findMany({
      where: {
        members: {
          some: {
            uid: userId,
          },
        },
      },
      include: {
        members: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        admins: {
          select: {
            uid: true,
            name: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        messages: {
          select: {
            mid: true,
            content: true,
            sender: true,
            creationDate: true,
          },
          orderBy: {
            creationDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async postNewChat(members: string[]): Promise<Chat & Partial<User>> {
    return await this.prisma.chat.create({
      data: {
        members: {
          connect: members.map((uid: string) => ({ uid })),
        },
      },
      include: {
        members: {
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

  static getInstance(prisma: PrismaClient): PostgresChatRepository {
    if (!PostgresChatRepository.instance) {
      PostgresChatRepository.instance = new PostgresChatRepository(prisma);
    }
    return PostgresChatRepository.instance;
  }
}
