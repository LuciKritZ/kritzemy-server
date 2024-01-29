import { type Document } from 'mongoose';
import { CloudinaryImage } from './cloudinary.dto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: CloudinaryImage;
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
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

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdateProfileAvatar {
  avatar: string;
}
