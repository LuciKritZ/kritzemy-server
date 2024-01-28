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
