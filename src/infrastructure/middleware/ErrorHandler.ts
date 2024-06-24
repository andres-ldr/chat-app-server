import { Request, Response } from 'express';
import BaseError from '../../Utils/BaseError';

const ErrorHandler = (err: BaseError, req: Request, res: Response) => {
  const errStatus = err.code || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};

export default ErrorHandler;
