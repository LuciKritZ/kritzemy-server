import {
  type CallbackWithoutResultAndOptionalError,
  type Model,
  Schema,
  model,
} from 'mongoose';
import { compare, hash } from 'bcrypt';
import { IUser } from '@/dto';
import { getEnvVariable } from '@/config';
import { sign } from 'jsonwebtoken';

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: 'Please enter a valid email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        // TODO: Including courseID reference
        courseId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hashing password before saving
UserSchema.pre<IUser>(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) {
      next();
    }
    this.password = await hash(this.password, 10);
    next();
  }
);

// Comparing passwords
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await compare(enteredPassword, this.password);
};

// Sign Access Token
UserSchema.methods.SignAccessToken = function (): string {
  const ACCESS_TOKEN_SECRET_KEY = getEnvVariable('ACCESS_TOKEN_SECRET_KEY');
  return sign({ id: this._id }, ACCESS_TOKEN_SECRET_KEY);
};

// Sign Refresh Token
UserSchema.methods.SignRefreshToken = function (): string {
  const REFRESH_TOKEN_SECRET_KEY = getEnvVariable('REFRESH_TOKEN_SECRET_KEY');
  return sign({ id: this._id }, REFRESH_TOKEN_SECRET_KEY);
};

const UserModel: Model<IUser> = model('User', UserSchema);

export default UserModel;
