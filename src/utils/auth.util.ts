import { getEnvVariable } from '@/config';
import { IActivationToken, IUser } from '@/dto';
import { type Secret, sign, verify } from 'jsonwebtoken';

const JWT_AUTH_SECRET: Secret = getEnvVariable('JWT_AUTH_SECRET');

export const createOTPCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export function createActivationToken<T>(user: T): IActivationToken {
  const activationCode = createOTPCode();

  const token = sign(
    {
      user,
      activationCode,
    },
    JWT_AUTH_SECRET,
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
  const verified = verify(token, JWT_AUTH_SECRET);

  return verified as T;
}
