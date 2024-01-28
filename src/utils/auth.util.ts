import { getEnvVariable } from '@/config';
import { IActivationToken, ITokenOptions, IUser } from '@/dto';
import { redisClient } from '@/services';
import { Response } from 'express';
import { type Secret, sign, verify } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET_KEY: Secret = getEnvVariable(
  'ACCESS_TOKEN_SECRET_KEY'
);

const createOTPCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const generateTokenOptions = (
  tokenType: 'ACCESS_TOKEN_VALIDITY' | 'REFRESH_TOKEN_VALIDITY',
  defaultValue: string
): ITokenOptions => {
  const token = parseInt(getEnvVariable(tokenType) ?? defaultValue, 10);
  const secure = getEnvVariable('NODE_ENV') === 'production';
  return {
    expires: new Date(Date.now() + token * 1000),
    maxAge: token * 1000,
    httpOnly: true,
    sameSite: 'lax',
    // Only set secure to true in production
    secure,
  };
};

export function createActivationToken<T>(user: T): IActivationToken {
  const activationCode = createOTPCode();

  const token = sign(
    {
      user,
      activationCode,
    },
    ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: '5m',
    }
  );

  return {
    token,
    activationCode,
  };
}

export function verifyActivationToken<T>(token: string): T {
  const verified = verify(token, ACCESS_TOKEN_SECRET_KEY);

  return verified as T;
}

export const sendSecurityTokens = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Session tracking to redis
  redisClient.set(user._id, JSON.stringify(user));

  const accessTokenOptions: ITokenOptions = generateTokenOptions(
    'ACCESS_TOKEN_VALIDITY',
    '300'
  );

  const refreshTokenOptions: ITokenOptions = generateTokenOptions(
    'REFRESH_TOKEN_VALIDITY',
    '1200'
  );

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
