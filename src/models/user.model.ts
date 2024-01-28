import {
  type CallbackWithoutResultAndOptionalError,
  type Document,
  type Model,
  Schema,
  model,
} from 'mongoose';
import { compare, hash } from 'bcrypt';
import { IUser } from '@/dto';

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

const UserModel: Model<IUser> = model('User', UserSchema);

export default UserModel;
