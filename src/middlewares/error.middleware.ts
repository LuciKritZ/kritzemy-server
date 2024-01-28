import { ErrorHandler } from '@/utils';
import type { NextFunction, Request, Response } from 'express';

export const CatchAsyncErrors =
  (func: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };

export const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set the statusCode to 500 if the statusCode doesn't exist.
  error.statusCode = error.statusCode || 500;

  // Set the message to "Internal Server Error" if message doesn't exist.
  error.message = error.message || 'Internal server error';

  // Invalid MongoDB connection
  if (error.name === 'CastError') {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 404);
  }

  // Duplicate key error
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered.`;
    error = new ErrorHandler(message, 404);
  }

  // Invalid JWT error
  if (error.name === 'JsonWebTokenError') {
    const message = `Invalid web token, please try again.`;
    error = new ErrorHandler(message, 400);
  }

  // Expired JWT token
  if (error.name === 'TokenExpiredError') {
    const message = `Json web token has expired, please try again.`;
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default ErrorMiddleware;
