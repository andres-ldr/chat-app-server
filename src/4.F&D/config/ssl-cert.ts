import * as fs from 'fs';

export const sslOptions = {
  key: fs.readFileSync('credentials/key.pem'),
  cert: fs.readFileSync('credentials/cert.pem'),
};
