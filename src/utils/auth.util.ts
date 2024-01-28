import { getEnvVariable } from '@/config';
import { IActivationToken, IUser } from '@/dto';
import { type Secret, sign, verify } from 'jsonwebtoken';

const ACCESS_TOKEN_PRIVATE_KEY: Secret = getEnvVariable(
  'ACCESS_TOKEN_PRIVATE_KEY'
);

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
    ACCESS_TOKEN_PRIVATE_KEY,
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
  const verified = verify(token, ACCESS_TOKEN_PRIVATE_KEY);

  return verified as T;
}
