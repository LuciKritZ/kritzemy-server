import { Router } from 'express';
import {
  activateUser,
  loginUser,
  logoutUser,
  registerUser,
} from '@/controllers';
import { isAuthenticated } from '@/middlewares';

const router = Router();

router.post('/register', registerUser);
router.post('/activate-user', activateUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);

export { router as UserRouter };
