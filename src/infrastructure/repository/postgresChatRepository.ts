import { PrismaClient } from '@prisma/client';
import ChatRepository from '../../domain/ChatRepository';
import { ChatEntity } from '../../domain/Chat';
import BaseError from '../../Utils/BaseError';
import { UserEntity } from '../../domain/User';

export default class PostgresChatRepository implements ChatRepository {
  private static instance: PostgresChatRepository;
  constructor(private readonly prisma: PrismaClient) {}

  async deleteAdmins(chatData: {
    cid: string;
    userIds: string[];
  }): Promise<any> {
    return await this.prisma.chat.update({
      where: {
        cid: chatData.cid,
      },
      data: {
        admins: {
          disconnect: chatData.userIds.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
    });
  }

  async postAdmins({
    cid,
    userIds,
  }: {
    cid: string;
    userIds: string[];
  }): Promise<any> {
    return this.prisma.chat.update({
      where: {
        cid,
      },
      data: {
        admins: {
          connect: userIds.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
    });
  }

  async checkIfUserIsAdmin(cid: string, userId: string): Promise<any> {
    return await this.prisma.chat.findFirst({
      where: {
        cid: cid,
        admins: {
          some: {
            uid: userId,
          },
        },
      },
    });
  }

  async exitGroup({
    cid,
    userId,
  }: {
    cid: string;
    userId: string;
  }): Promise<any> {
    return await this.prisma.chat.update({
      where: {
        cid,
      },
      data: {
        members: {
          disconnect: {
            uid: userId,
          },
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
  }): Promise<any> {
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

  async updateGroup({
    cid,
    alias,
    chatImage,
    adminId,
    admins,
    members,
  }: {
    cid: string;
    alias: string;
    chatImage: string;
    adminId: string;
    admins: UserEntity[];
    members: UserEntity[];
  }): Promise<any> {
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
        //   connect: admins.map((e: UserEntity) => {
        //     return {
        //       uid: e.uid,
        //     };
        //   }),
        // },
        // members: {
        //   connect: members.map((e: UserEntity) => {
        //     return {
        //       uid: e.uid,
        //     };
        //   }),
        // },
      },
    });
  }

  async removeMembersFromGroup({
    cid,
    members,
    adminId,
  }: {
    cid: string;
    members: string[];
    adminId: string;
  }): Promise<any> {
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
          disconnect: members.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
    });
  }

  async addMembersToGroup(chatData: {
    cid: string;
    members: string[];
    adminId: string;
  }): Promise<any> {
    return await this.prisma.chat.update({
      where: {
        cid: chatData.cid,
        admins: {
          some: {
            uid: chatData.adminId,
          },
        },
      },
      data: {
        members: {
          connect: chatData.members.map((e: string) => {
            return {
              uid: e,
            };
          }),
        },
      },
    });
  }

  async postNewGroup(chatData: {
    alias: string;
    chatImage: string;
    admins: UserEntity[];
    members: UserEntity[];
  }): Promise<{
    cid: string;
    alias: string | null;
    creationDate: Date;
    chatImage: string | null;
    isGroup: boolean;
  }> {
    const newGroup = await this.prisma.chat.create({
      data: {
        alias: chatData.alias,
        chatImage: chatData.chatImage,
        isGroup: true,
        admins: {
          connect: chatData.admins.map(({ uid }: UserEntity) => {
            return {
              uid: uid,
            };
          }),
        },
        members: {
          connect: chatData.members.map(({ uid }: UserEntity) => {
            return {
              uid: uid,
            };
          }),
        },
      },
    });
    console.log(newGroup);

    return newGroup;
  }

  async deleteChat(cid: string, uid: string): Promise<any> {
    return await this.prisma.chat.update({
      where: {
        cid: cid,
      },
      data: {
        members: {
          disconnect: {
            uid: uid,
          },
        },
      },
    });
  }

  async getChatByMembers(cid: string): Promise<any> {
    return this.prisma.chat.findUnique({
      where: {
        cid: cid,
      },
    });
  }

  async getChatById(id: string): Promise<any> {
    return this.prisma.chat.findUnique({
      where: {
        cid: id,
      },
    });
  }

  async getChats(userId: string): Promise<any[] | null> {
    return await this.prisma.chat.findMany({
      where: {
        members: {
          some: {
            uid: userId,
          },
        },
      },
    });
  }

  async postNewChat(members: any[]): Promise<any> {
    return this.prisma.chat.create({
      data: {
        members: {
          connect: members.map((e: UserEntity) => {
            return {
              uid: e.uid,
            };
          }),
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
