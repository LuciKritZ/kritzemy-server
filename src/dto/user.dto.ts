import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export interface IVerifiedAccountType {
  user: IUser;
  activationCode: string;
}