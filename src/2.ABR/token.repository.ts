export default interface TokenRepository {
  generateToken(uid: string): string;
  verifyToken(token: string): any;
}
