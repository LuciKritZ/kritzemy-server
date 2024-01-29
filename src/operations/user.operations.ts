import { AUTH_ERRORS } from '@/constants';
import { redisClient } from '@/services';
import { Response } from 'express';

// Get user by id
export const getUserById = async (id: string, res: Response) => {
  let user = await redisClient.get(id);

  if (user) {
    user = JSON.parse(user);
    return res.status(200).json({
      success: true,
      user,
    });
  }
  return res.status(401).json({
    success: false,
    message: AUTH_ERRORS.LOGIN_TO_CONTINUE,
  });
};
