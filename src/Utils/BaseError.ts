export default class BaseError extends Error {
  code: number;
  stack?: string;
  constructor(message: string, errorCode: number, stack?: string) {
    super(message);
    this.code = errorCode;
    this.stack = stack;
  }
}

module.exports = BaseError;
