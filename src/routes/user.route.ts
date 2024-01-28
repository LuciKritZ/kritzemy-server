import { Router, Request, Response, NextFunction } from 'express';
import { activateUser, registerUser } from '@/controllers';

const router = Router();

router.post('/register', registerUser);
router.post('/activate-user', activateUser);

export { router as UserRouter };
