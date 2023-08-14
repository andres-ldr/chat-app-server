import { Request, Response, NextFunction } from 'express';
import TokenRepository from '../../2.ABR/token.repository';
import * as jwt from 'jsonwebtoken';
import BaseError from '../../Utils/BaseError';

export default class JwtRepository implements TokenRepository {
  private key: string;
  expiration: string;
  constructor(key: string, expiration: string) {
    this.key = key;
    this.expiration = expiration;
  }
  verifyToken(token: string): any {
    try {
      const decodedToken: any = jwt.verify(token, this.key);
      return { uid: decodedToken.uid, uemail: decodedToken.email };
    } catch (error) {
      throw error;
    }
  }

  generateToken(uid: string): string {
    let token;
    try {
      token = jwt.sign({ uid }, this.key, {
        algorithm: 'HS256',
        expiresIn: this.expiration,
      });
    } catch (err) {
      throw err;
    }
    return token;
  }
}
