import http from 'http';
import { Server as WebSocketServer } from 'socket.io';
import UserUsesCases from '../application/userUseCase';

export const initSocketIO = (
  server: http.Server,
  userUseCases: UserUsesCases
) => {
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
    socket.on('CLIENT:SEND_MSG', async ({ cid, content, type, senderId }) => {
      const msg = await userUseCases.sendMsg(cid, content, type, senderId);
      socket.to(`${cid}`).emit('SERVER:SEND_MSG', msg);
      socket.emit('SERVER:SAVED_MSG', msg);
    });
  });
};
