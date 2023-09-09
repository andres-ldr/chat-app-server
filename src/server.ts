import { Server as WebSocketServer } from 'socket.io';
import { app } from './4.F&D/app';
require('dotenv').config();
import http from 'http';
import { userUseCases } from './3.IA/routes/users.router';
declare module 'express-session' {
  interface SessionData {
    passport: { user: string };
  }
}

const PORT = process.env.PORT;

const server: http.Server = http.createServer(app);
export const io = new WebSocketServer(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

async function startServer() {
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

  server.listen(PORT, () => console.log(`READY IN PORT [${PORT}]`));
}

startServer();
