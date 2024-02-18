import http from 'http';
import { app } from './infrastructure/app';
import { initSocketIO } from './infrastructure/socketIO';
import { userUseCases } from './presentation/routes/users.router';
require('dotenv').config();
declare module 'express-session' {
  interface SessionData {
    passport: { user: string };
  }
}

const PORT = process.env.PORT;

export const server: http.Server = http.createServer(app);

async function startServer() {
  initSocketIO(server, userUseCases);
  server.listen(PORT, () => console.log(`READY IN PORT [${PORT}]`));
}

startServer();
