import http from 'http';
import * as fs from 'fs';
import { app } from './4.F&D/app';
require('dotenv').config();

const PORT = process.env.PORT;
const options = {
  key: fs.readFileSync('credentials/key.pem'),
  cert: fs.readFileSync('credentials/cert.pem'),
};

declare module 'express-session' {
  interface SessionData {
    passport: { user: string };
  }
}
const server: http.Server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => console.log(`READY IN PORT [${PORT}]`));
}

startServer();
