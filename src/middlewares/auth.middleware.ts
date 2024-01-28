import type { NextFunction, Request, Response } from 'express';
import { CatchAsyncErrors } from './error.middleware';
import { ErrorHandler, decodeSecurityToken } from '@/utils';
import { JwtPayload } from 'jsonwebtoken';
import { redisClient } from '@/services';
import { AUTH_ERRORS } from '@/constants';

export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler(AUTH_ERRORS.LOGIN_TO_CONTINUE, 400));
    }

    const decoded = decodeSecurityToken(
      access_token,
      'ACCESS_TOKEN_SECRET_KEY'
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler(AUTH_ERRORS.INVALID_ACCESS_TOKEN, 400));
    }

    const user = await redisClient.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler(AUTH_ERRORS.USER_NOT_FOUND, 404));
    }

    req.user = JSON.parse(user);

    next();
  }
);

// Validate user roles and authorization
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role && !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not authorized to access this resource`,
          403
        )
      );
    }
  };
};
