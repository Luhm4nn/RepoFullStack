import { Router } from 'express';
import { login, refresh, logout, logoutAllSessions, getCsrfToken } from './auth.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { loginLimiter, strictLimiter } from '../Middlewares/rateLimiter.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { loginSchema } from '../validations/AuthSchema.js';

const router = Router();

router.get('/auth/csrf-token', asyncHandler(getCsrfToken));
router.post('/auth/login', loginLimiter, validateBody(loginSchema), asyncHandler(login));
router.post('/auth/refresh', strictLimiter, asyncHandler(refresh));
router.post('/auth/logout', asyncHandler(logout));
router.post('/auth/revoke-all-sessions', authMiddleware, asyncHandler(logoutAllSessions));

export const authRoutes = router;
