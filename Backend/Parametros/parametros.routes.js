import { Router } from 'express';
import {
  getParametros,
  getParametro,
  createParametro,
  deleteParametro,
  updateParametro,
  getTiempoLimiteReserva
} from './parametros.controllers.js';
import { validateBody, validateParams } from '../Middlewares/validateRequest.js';
import { parametrosSchema } from '../validations/ParametrosSchema.js';
import { idParamSchema } from '../validations/CommonSchemas.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';

const router = Router();

// Rutas de administración de parámetros globales (ADMIN)
router.get('/Parametros', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(getParametros));
router.get('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(getParametro));
router.post('/Parametro', authMiddleware, authorizeRoles('ADMIN'), validateBody(parametrosSchema), asyncHandler(createParametro));
router.put('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), validateBody(parametrosSchema), asyncHandler(updateParametro));
router.delete('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(deleteParametro));

// Rutas accesibles por clientes
router.get('/Parametros/tiempo-limite-reserva', authMiddleware, authorizeRoles('ADMIN', 'CLIENTE'), asyncHandler(getTiempoLimiteReserva));

export const parametrosRoutes = router;
