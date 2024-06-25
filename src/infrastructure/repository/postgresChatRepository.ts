import { PrismaClient } from '@prisma/client';
import ChatRepository, { ChatCreateType } from '../../domain/ChatRepository';
import { Chat } from '../../domain/Chat';

export default class PostgresChatRepository implements ChatRepository { 
  private static instance: PostgresChatRepository;
  constructor(private readonly prisma: PrismaClient) {}

  // async deleteAdmins(chatData: { cid: string; userIds: string[] }): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  // }> {
  //   return await this.prisma.chat.update({
  //     where: {
  //       cid: chatData.cid,
  //     },
  //     data: {
  //       admins: {
  //         disconnect: chatData.userIds.map((e: string) => {
  //           return {
  //             uid: e,
  //           };
  //         }),
  //       },
  //     },
  //   });
  // }

  // async postAdmins({
  //   cid,
  //   userIds,
  // }: {
  //   cid: string;
  //   userIds: string[];
  // }): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // }> {
  //   return this.prisma.chat.update({
  //     where: {
  //       cid,
  //     },
  //     data: {
  //       admins: {
  //         connect: userIds.map((e: string) => {
  //           return {
  //             uid: e,
  //           };
  //         }),
  //       },
  //     },
  //   });
  // }

  // async checkIfUserIsAdmin(
  //   cid: string,
  //   userId: string
  // ): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // } | null> {
  //   return await this.prisma.chat.findFirst({
  //     where: {
  //       cid: cid,
  //       admins: {
  //         some: {
  //           uid: userId,
  //         },
  //       },
  //     },
  //   });
  // }

  // async exitGroup({ cid, userId }: { cid: string; userId: string }): Promise<{
  //   cid: string;
  //   alias: string | null;
  //   creationDate: Date;
  //   chatImage: string | null;
  //   isGroup: boolean;
  // }> {
  //   return await this.prisma.chat.update({
  //     where: {
  //       cid,
  //     },
  //     data: {
  //       members: {
  //         disconnect: {
  //           uid: userId,
  //         },
  //       },
  //     },
  //   });
  // }

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
      admins,
      members,
    }: {
      cid: string;
      alias: string;
      chatImage: string | null;
      admins: string[];
      members: string[];
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
        admins: {
          connect: admins.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
        members: {
          connect: members.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
    });
  }

  // async removeMembersFromGroup({
  //   cid,
  //   members,
  //   adminId,
  // }: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }): Promise<Chat> {
  //   return await this.prisma.chat.update({
  //     where: {
  //       cid: cid,
  //       admins: {
  //         some: {
  //           uid: adminId,
  //         },
  //       },
  //     },
  //     data: {
  //       members: {
  //         disconnect: members.map((e: string) => {
  //           return {
  //             uid: e,
  //           };
  //         }),
  //       },
  //     },
  //   });
  // }

  // async addMembersToGroup(chatData: {
  //   cid: string;
  //   members: string[];
  //   adminId: string;
  // }): Promise<Chat> {
  //   return await this.prisma.chat.update({
  //     where: {
  //       cid: chatData.cid,
  //       admins: {
  //         some: {
  //           uid: chatData.adminId,
  //         },
  //       },
  //     },
  //     data: {
  //       members: {
  //         connect: chatData.members.map((e: string) => {
  //           return {
  //             uid: e,
  //           };
  //         }),
  //       },
  //     },
  //     include: {
  //       members: {
  //         select: {
  //           uid: true,
  //           name: true,
  //           lastName: true,
  //           email: true,
  //           profileImage: true,
  //         },
  //       },
  //       admins: {
  //         select: {
  //           uid: true,
  //           name: true,
  //           lastName: true,
  //           email: true,
  //           profileImage: true,
  //         },
  //       },
  //       messages: {
  //         select: {
  //           mid: true,
  //           content: true,
  //           sender: true,
  //           creationDate: true,
  //         },
  //         orderBy: {
  //           creationDate: 'desc',
  //         },
  //         take: 1,
  //       },
  //     },
  //   });
  // }

  async postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: string[];
    members: string[];
  }): Promise<ChatCreateType> {
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

  async getChatByMembers(members: string[]): Promise<Chat | null> {
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

  async getChatById(id: string): Promise<Chat | null> {
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

  async getChats(userId: string): Promise<Chat[]> {
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

  async postNewChat(members: string[]): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        members: {
          connect: members.map((e: string) => ({
            uid: e,
          })),
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
