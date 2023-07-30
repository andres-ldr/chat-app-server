import http from 'http';
import { app } from './4.F&D/app';
require('dotenv').config();

const PORT = process.env.PORT;

const server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => console.log(`READY IN PORT [${PORT}]`));
}

startServer();
