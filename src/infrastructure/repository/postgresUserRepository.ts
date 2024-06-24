import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';
import UserRepository from '../../domain/UserRepository';
import { UserEntity } from '../../domain/User';

export default class PostgresUserRepository implements UserRepository {
  private static instance: PostgresUserRepository;

  constructor(readonly prisma: PrismaClient) {
    // this.prisma = new PrismaClient();
    // this.pool = new Pool({
    //   user: `${process.env.POSTGRES_USER}`,
    //   password: `${process.env.POSTGRES_PASSWORD}`,
    //   host: `${process.env.POSTGRES_HOST}`,
    //   port: Number(process.env.POSTGRES_PORT),
    //   database: `${process.env.POSTGRES_DB}`,
    // });
  }

  async getUsersByEmail(email: string): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
    });
  }

  async getUsersByName(name: string): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  async updateUser(uid: string, user: UserEntity): Promise<UserEntity> {
    const { password } = user;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return await this.prisma.user.update({
      where: { uid },
      data: user,
    });
  }

  async deleteUser(uid: string): Promise<UserEntity> {
    return await this.prisma.user.delete({
      where: { uid },
    });
  }

  async getUserById(uuid: string): Promise<UserEntity | null> {
    let result;
    try {
      result = await this.userExists(uuid);
      if (!result) {
        throw new BaseError('User does not exists', 404);
      }
    } catch (err) {
      const error: Error = err as Error;
      throw new BaseError(
        `Couldn't get user by id`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return result;
  }

  async postNewUser(user: UserEntity): Promise<UserEntity> {
    const { name, lastName, email, password, profileImage } = user;
    let result;
    try {
      if (await this.emailExists(email)) {
        throw new BaseError('User already exists', HttpStatusCode.BAD_REQUEST);
      }

      const hash = await bcrypt.hash(password, 10);
      result = await this.prisma.user.create({
        data: { name, lastName, email, password: `${hash}`, profileImage },
      });
    } catch (err) {
      const error: Error = err as Error;

      throw new BaseError(
        `${error.message}`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }

    return result;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    let result;
    try {
      result = await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (err) {
      const error: Error = err as Error;
      throw new BaseError(
        `Couldn't get user by email`,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.stack
      );
    }
    return result;
  }

  async emailExists(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async userExists(uid: string): Promise<UserEntity> {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { uid } });
    } catch (error) {
      throw new BaseError('No user found', 404);
    }
  }

  async getMembersOfAChat(cid: string): Promise<UserEntity[]> {
    try {
      const members = await this.prisma.user.findMany({
        where: {
          chats: {
            some: {
              cid,
            },
          },
        },
      });
      return members;
    } catch (error) {
      throw new BaseError(
        'Could not find members for this chat',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAdminsOfAGroupChat(cid: string): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      where: {
        chatsWhichImAdmin: {
          some: {
            cid,
          },
        },
        // chats: {
        //   some: {
        //     cid,
        //   },
        // },
      },
    });
  }

  static getInstance(prisma: PrismaClient): PostgresUserRepository {
    if (!PostgresUserRepository.instance) {
      PostgresUserRepository.instance = new PostgresUserRepository(prisma);
    }
    return PostgresUserRepository.instance;
  }

  // async findTheOtherMemberOfAChat(cid: string, uid: string): Promise<any> {
  //   try {
  //     const theOtherMember = await this.prisma.user.findFirst({
  //       where: {
  //         AND: {
  //           chats: {
  //             some: {
  //               cid,
  //             },
  //           },
  //           NOT: {
  //             uid,
  //           },
  //         },
  //       },
  //     });
  //     return theOtherMember;
  //   } catch (error) {
  //     throw new BaseError(
  //       'Could not find another member for this chat',
  //       HttpStatusCode.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async findUsersContactByEmail(uid: string, email: string): Promise<any> {
  //   try {
  //     const usersContact = await this.prisma.contact.findFirst({
  //       where: {
  //         AND: {
  //           authorId: uid,
  //           email: email,
  //         },
  //       },
  //     });
  //     return usersContact;
  //   } catch (error) {
  //     throw new BaseError(
  //       'Could not find a contact for this user with this email',
  //       HttpStatusCode.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async findChatByMembers(
  //   alias: string | null,
  //   members: { email: string }[]
  // ): Promise<ChatEntity | null> {
  //   let ids: string[] = [];
  //   try {
  //     members.forEach((obj: { email: string }) => ids.push(obj.email));

  //     return await this.prisma.chat.findFirst({
  //       where: {
  //         AND: [
  //           { alias },
  //           {
  //             members: {
  //               every: {
  //                 email: {
  //                   in: ids,
  //                 },
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async contactExists(authorId: string, email: string): Promise<{} | null> {
  //   return await this.prisma.contact.findFirst({
  //     where: {
  //       authorId: {
  //         equals: authorId,
  //       },
  //       email: {
  //         equals: email,
  //       },
  //     },
  //   });
  // }

  // async fetchAllChats(uid: string): Promise<ChatEntity[] | []> {
  //   let AllChats: ChatEntity[];
  //   try {
  //     AllChats = await this.prisma.chat.findMany({
  //       where: { members: { some: { uid } } },
  //     });
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Couldn't fetch all chats`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  //   return AllChats;
  // }

  // async fetchAllContacts(uid: string): Promise<{}[]> {
  //   let result;
  //   try {
  //     result = await this.prisma.contact.findMany({ where: { authorId: uid } });
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Couldn't fetch contacts`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  //   return result;
  // }
  // async postNewContact(
  //   authorId: string,
  //   alias: string,
  //   email: string
  // ): Promise<{}> {
  //   let contactCreated;

  //   try {
  //     const contact = await this.emailExists(email);
  //     if (!contact) {
  //       throw new BaseError('User not found', HttpStatusCode.NOT_FOUND);
  //     }

  //     if (await this.contactExists(authorId, email)) {
  //       throw new BaseError('Contact already exists', 404);
  //     }
  //     contactCreated = await this.prisma.contact.create({
  //       data: {
  //         alias,
  //         email,
  //         authorId,
  //         profileImage: contact.profileImage,
  //       },
  //     });
  //     return { ...contactCreated, profileImage: contact.profileImage };
  //   } catch (err) {
  //     let error: BaseError = err as BaseError;
  //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //       // The .code property can be accessed in a type-safe manner
  //       if (err.code === 'P2023') {
  //         error.message =
  //           'There is a unique constraint violation, a new user cannot be created with this email';
  //         error.code = HttpStatusCode.INTERNAL_SERVER_ERROR;
  //       }
  //     }
  //     throw new BaseError(`${error.message}`, error.code, error.stack);
  //   }
  // }
  // async postNewChat(
  //   alias: string | null,
  //   members: [],
  //   lisOfAdmins: { uid: string }[],
  //   chatImage: string | null
  // ): Promise<ChatEntity> {
  //   let newChat: ChatEntity;

  //   try {
  //     newChat = await this.prisma.chat.create({
  //       data: {
  //         alias,
  //         members: {
  //           connect: members,
  //         },
  //         admins: {
  //           connect: lisOfAdmins,
  //         },
  //         chatImage,
  //       },
  //     });

  //     return newChat;
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Chat couldn't be created`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  // }
  // async postNewMsg(
  //   chatId: string,
  //   content: string,
  //   type: string,
  //   senderId: string
  // ): Promise<MsgEntity> {
  //   let newMsg;
  //   try {
  //     newMsg = await this.prisma.message.create({
  //       data: {
  //         chatId,
  //         content,
  //         type,
  //         senderId,
  //       },
  //     });
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Could not send message, maybe chat or user are wrong`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  //   return newMsg;
  // }
  // async fetchChatById(uid: string, cid: string): Promise<ChatEntity> {
  //   let chat;
  //   try {
  //     chat = await this.prisma.chat.findFirstOrThrow({
  //       where: { cid },
  //     });
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Could not get chat, maybe chat id or user are wrong`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  //   return chat;
  // }
  // async fetchChatMsgs(cid: string): Promise<MsgEntity[]> {
  //   try {
  //     const msgs = await this.prisma.message.findMany({
  //       where: {
  //         chatId: cid,
  //       },
  //     });
  //     return msgs;
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Could not get messages, maybe chat id is wrong`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  // }
  // async fetchChatMembers(cid: string): Promise<UserEntity[]> {
  //   try {
  //     const members = await this.prisma.user.findMany({
  //       where: {
  //         chats: {
  //           some: {
  //             cid,
  //           },
  //         },
  //       },
  //     });
  //     return members;
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Could not get messages, maybe chat id is wrong`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  // }

  // async isAnUserContact(
  //   uid: string,
  //   email: string
  // ): Promise<ContactEntity | null> {
  //   try {
  //     const contact = this.prisma.contact.findFirst({
  //       where: {
  //         authorId: uid,
  //         email,
  //       },
  //     });
  //     return contact;
  //   } catch (err) {
  //     let error: Error = err as Error;
  //     throw new BaseError(
  //       `Could not get contact, something wrong`,
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       error.stack
  //     );
  //   }
  // }
}
