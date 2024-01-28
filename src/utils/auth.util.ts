import { getEnvVariable } from '@/config';
import {
  IActivationToken,
  IGenerateTokenOptions,
  IGetGeneratedTokenOptions,
  ISignSecurityToken,
  ITokenOptions,
  ITokenType,
  IUser,
} from '@/dto';
import { redisClient } from '@/services';
import { Response } from 'express';
import { type Secret, sign, verify, JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET_KEY: Secret = getEnvVariable(
  'ACCESS_TOKEN_SECRET_KEY'
);

const createOTPCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const generateTokenOptions = ({
  tokenType,
  defaultValue,
  maxAgeMultiplier = 1,
}: IGenerateTokenOptions): ITokenOptions => {
  const token = parseInt(getEnvVariable(tokenType) ?? defaultValue, 10);
  const maxAge = token * maxAgeMultiplier * 60 * 60 * 1000;
  const secure = getEnvVariable('NODE_ENV') === 'production';
  return {
    expires: new Date(Date.now() + maxAge),
    maxAge,
    httpOnly: true,
    sameSite: 'lax',
    // Only set secure to true in production
    secure,
  };
};

export const getGeneratedTokenOptions = (): IGetGeneratedTokenOptions => {
  const accessTokenOptions: ITokenOptions = generateTokenOptions({
    tokenType: 'ACCESS_TOKEN_VALIDITY',
    maxAgeMultiplier: 1,
    defaultValue: '300',
  });

  const refreshTokenOptions: ITokenOptions = generateTokenOptions({
    tokenType: 'REFRESH_TOKEN_VALIDITY',
    maxAgeMultiplier: 24,
    defaultValue: '1200',
  });

  return {
    accessTokenOptions,
    refreshTokenOptions,
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

  const { accessTokenOptions, refreshTokenOptions } =
    getGeneratedTokenOptions();

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  return res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

export const decodeSecurityToken = (token: string, tokenType: ITokenType) => {
  const SECRET_KEY = getEnvVariable(tokenType);
  const decoded = verify(token, SECRET_KEY) as JwtPayload;

  return decoded;
};

export const signSecurityToken = ({
  id,
  tokenType,
  expiresIn,
}: ISignSecurityToken): string => {
  const SECRET_KEY = getEnvVariable(tokenType);
  const token = sign({ id }, SECRET_KEY, {
    expiresIn,
  });
  return token;
};
