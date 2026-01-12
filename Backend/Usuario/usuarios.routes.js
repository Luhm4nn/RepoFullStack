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
import { validateBody, validateParams } from '../Middlewares/validateRequest.js';
import { usuarioCreateSchema, usuarioUpdateSchema } from '../validations/UsuariosSchema.js';
import { dniParamSchema } from '../validations/CommonSchemas.js';


const router = Router();

router.get('/Usuarios', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(getUsuarios));

router.get('/Usuario/:dni', authMiddleware, validateParams(dniParamSchema), asyncHandler(getUsuario));

router.post('/Usuario', registerLimiter, validateBody(usuarioCreateSchema), asyncHandler(createUsuario));

router.put('/Usuario/:dni', authMiddleware, generalLimiter, validateParams(dniParamSchema), validateBody(usuarioUpdateSchema), asyncHandler(updateUsuario));

router.delete('/Usuario/:dni', authMiddleware, authorizeRoles('ADMIN'), validateParams(dniParamSchema), asyncHandler(deleteUsuario));

export const usuariosRoutes = router;
