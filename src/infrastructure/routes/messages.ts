import { Router } from 'express';
import prismaClient from '../config/prisma-client';
import MessageUseCase from '../../application/messageUseCase';
import PostgresMessageRepository from '../repository/postgresMessageRepository';
import MessagesController from '../controller/message';
import PostgresUserRepository from '../repository/postgresUserRepository';
// import { io } from '../../server';

export const messagesRouter = Router();

const prisma = prismaClient.getInstance();
const messageRepository = PostgresMessageRepository.getInstance(prisma);
const userRepository = PostgresUserRepository.getInstance(prisma);
const messageUseCases = MessageUseCase.getInstance(
  messageRepository,
  userRepository
);

const messagesController = new MessagesController(messageUseCases);

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/new', messagesController.postMessage);
