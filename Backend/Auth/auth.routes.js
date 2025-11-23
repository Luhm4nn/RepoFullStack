import { Router } from 'express';
import { login, refresh, logout, logoutAllSessions } from './auth.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { loginLimiter, strictLimiter } from '../Middlewares/rateLimiter.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/login', loginLimiter, asyncHandler(login));
router.post('/auth/refresh', strictLimiter, asyncHandler(refresh));
router.post('/auth/logout', asyncHandler(logout));
router.post('/auth/revoke-all-sessions', authMiddleware, asyncHandler(logoutAllSessions));

export const authRoutes = router;
