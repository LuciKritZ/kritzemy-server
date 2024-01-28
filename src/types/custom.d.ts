import { IUser } from '@/dto';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
