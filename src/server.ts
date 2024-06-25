import http from 'http';
import { app } from './infrastructure/app';
import { Server as WebSocketServer } from 'socket.io';
import prismaClient from './infrastructure/config/prisma-client';
import PostgresMessageRepository from './infrastructure/repository/postgresMessageRepository';
import MessageUseCase from './application/messageUseCase';
import PostgresUserRepository from './infrastructure/repository/postgresUserRepository';
import 'dotenv/config';

declare module 'express-session' {
  interface SessionData {
    passport: { user: string };
  }
}

const server: http.Server = http.createServer(app);
const PORT = process.env.PORT;

const io = new WebSocketServer(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://gregarious-beijinho-ae0ab4.netlify.app',
  },
});

const prisma = prismaClient.getInstance();
const postgresMessageRepository = PostgresMessageRepository.getInstance(prisma);
const postgresUserRepository = PostgresUserRepository.getInstance(prisma);
const messageUseCase = MessageUseCase.getInstance(
  postgresMessageRepository,
  postgresUserRepository
);

io.on('connection', (socket) => {
  socket.on('join', async ({ cid }) => {
    const messages = await messageUseCase.getMessages(cid);
    socket.emit('messages', messages);
  });

  socket.on('message', async (message) => {
    const messageCreated = await messageUseCase.sendMessage(message);
    socket.to(`${messageCreated.chatId}`).emit('message', messageCreated);
    io.emit('message', messageCreated);
  });

  socket.on('edit-message', (message) => {
    messageUseCase.editMessage(message); // TODO: CHECK IF IT NEEDS TO GET THE SENDER
    socket.to(`${message.cid}`).emit('edit-message', message);
    io.emit('edit-message', message);
  });

  socket.on('delete-message', async (message) => {
    const messageDeleted = await messageUseCase.deleteMessage(message.mid);

    socket.to(`${message.cid}`).emit('delete-message', messageDeleted);
    io.emit('delete-message', messageDeleted);
  });
});

server.listen(PORT, () => console.log(`READY IN PORT [${PORT}]`));
