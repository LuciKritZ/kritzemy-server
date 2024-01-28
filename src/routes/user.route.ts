import { Router } from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialAuthentication,
  updateAccessToken,
} from '@/controllers';
import { isAuthenticated } from '@/middlewares';

const router = Router();

router.post('/register', registerUser);
router.post('/activate-user', activateUser);
router.post('/login', loginUser);
router.get('/refresh', updateAccessToken);
router.post('/social-login', socialAuthentication);

// Protected routes
router.use(isAuthenticated);
router.post('/logout', logoutUser);
router.get('/me', getUserInfo);

export { router as UserRouter };
