import { Router } from 'express';
import PostgresChatRepository from '../repository/postgresChatRepository';
import ChatUseCases from '../../application/chatUseCase';
import ChatController from '../controller/chat';
import prismaClient from '../config/prisma-client';
import PostgresUserRepository from '../repository/postgresUserRepository';
import fileUploader from '../middleware/fileUploader';

export const chatRouter = Router();

const prisma = prismaClient.getInstance();
const chatRepository = PostgresChatRepository.getInstance(prisma);
const postgresUserRepository = PostgresUserRepository.getInstance(prisma);
const chatUseCases = ChatUseCases.getInstance(
  chatRepository,
  postgresUserRepository
);

const chatController = new ChatController(chatUseCases);

chatRouter.get('/', chatController.getChats);
chatRouter.post('/new', chatController.postNewChat);
chatRouter.delete('/delete', chatController.deleteChat);
chatRouter.post(
  '/groups/new',
  fileUploader.single('chatImage'),
  chatController.postNewGroup
);
// chatRouter.post('/groups/add', chatController.addMembersToGroup);
// chatRouter.delete('/groups/remove', chatController.removeMembersFromGroup);
chatRouter.put(
  '/groups/update',
  fileUploader.single('chatImage'),
  chatController.updateGroup
);
chatRouter.delete('/groups/delete', chatController.deleteGroup);
// chatRouter.delete('/groups/exit', chatController.exitGroup);
