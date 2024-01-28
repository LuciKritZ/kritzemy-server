export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

export type ITokenType = 'ACCESS_TOKEN_SECRET_KEY' | 'REFRESH_TOKEN_SECRET_KEY';
export type ITokenValidityType =
  | 'ACCESS_TOKEN_VALIDITY'
  | 'REFRESH_TOKEN_VALIDITY';

export interface IGenerateTokenOptions {
  defaultValue: string;
  maxAgeMultiplier: number;
  tokenType: ITokenValidityType;
}

export interface IGetGeneratedTokenOptions {
  accessTokenOptions: ITokenOptions;
  refreshTokenOptions: ITokenOptions;
}

export type ISignSecurityToken = {
  expiresIn: string;
  id: string;
  tokenType: ITokenType;
};
