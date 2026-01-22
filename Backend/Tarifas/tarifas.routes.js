import { Router } from 'express';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody, validateParams } from '../Middlewares/validateRequest.js';
import { idParamSchema } from '../validations/CommonSchemas.js';
import { tarifasSchema } from '../validations/TarifasSchema.js';
import { getTarifas, getTarifa, updateTarifa } from './tarifas.controllers.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';

const router = Router();

router.get('/Tarifas', asyncHandler(getTarifas));

router.get('/Tarifa/:id', validateParams(idParamSchema), asyncHandler(getTarifa));

router.put(
  '/Tarifa/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateParams(idParamSchema),
  validateBody(tarifasSchema),
  asyncHandler(updateTarifa)
);

export const tarifasRoutes = router;
