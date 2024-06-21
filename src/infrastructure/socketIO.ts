import http from 'http';
import { Server as WebSocketServer } from 'socket.io';
import prismaClient from './config/prisma-client';
import MessageUseCase from '../application/messageUseCase';
import PostgresMessageRepository from './repository/postgresMessageRepository';
import PostgresUserRepository from './repository/postgresUserRepository';

export const initSocketIO = (server: http.Server) => {
  const io = new WebSocketServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5173'
          : 'https://gregarious-beijinho-ae0ab4.netlify.app',
    },
  });

  io.on('connection', (socket) => {
    socket.on('CLIENT:JOIN_ROOM', ({ cid }) => {
      socket.join(`${cid}`);
    });
    socket.on('CLIENT:SEND_MSG', async (message) => {
      const { cid } = message;

      const prisma = prismaClient.getInstance();

      const postgresMessageRepository =
        PostgresMessageRepository.getInstance(prisma);
      const postgresUserRepository = PostgresUserRepository.getInstance(prisma);

      const messageUseCase = MessageUseCase.getInstance(
        postgresMessageRepository,
        postgresUserRepository
      );

      socket
        .to(`${cid}`)
        .emit('SERVER:SEND_MSG', messageUseCase.sendMessage(message));
      socket.emit('SERVER:SAVED_MSG', message);
    });
  });
};
