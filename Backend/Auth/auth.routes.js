import { Router } from 'express';
import { login, refresh, logout } from './auth.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { loginLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

router.post('/auth/login', loginLimiter, asyncHandler(login));
router.post('/auth/refresh', asyncHandler(refresh));
router.post('/auth/logout', asyncHandler(logout));

export const authRoutes = router;
