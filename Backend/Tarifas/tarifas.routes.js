import { Router } from 'express';
import {
  getTarifas,
  getTarifa,
  createTarifa,
  updateTarifa,
  deleteTarifa
} from './tarifas.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody, validateParams } from '../Middlewares/validateRequest.js';
import { idParamSchema } from '../validations/CommonSchemas.js';
import { tarifasSchema } from '../validations/TarifasSchema.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';

const router = Router();

// Rutas públicas de consulta
router.get('/Tarifas', asyncHandler(getTarifas));
router.get('/Tarifa/:id', validateParams(idParamSchema), asyncHandler(getTarifa));

// Rutas de administración (ADMIN)
router.post(
  '/Tarifa',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateBody(tarifasSchema),
  asyncHandler(createTarifa)
);

router.put(
  '/Tarifa/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateParams(idParamSchema),
  validateBody(tarifasSchema),
  asyncHandler(updateTarifa)
);

router.delete(
  '/Tarifa/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateParams(idParamSchema),
  asyncHandler(deleteTarifa)
);

export const tarifasRoutes = router;
