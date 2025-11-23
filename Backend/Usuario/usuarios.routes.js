import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  deleteUsuario,
  updateUsuario,
} from './usuarios.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { registerLimiter, generalLimiter } from '../Middlewares/rateLimiter.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';

const router = Router();

router.get('/Usuarios', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(getUsuarios));

router.get('/Usuario/:dni', authMiddleware, asyncHandler(getUsuario));

router.post('/Usuario', registerLimiter, asyncHandler(createUsuario));

router.put('/Usuario/:dni', authMiddleware, generalLimiter, asyncHandler(updateUsuario));

router.delete('/Usuario/:dni', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(deleteUsuario));

export const usuariosRoutes = router;
