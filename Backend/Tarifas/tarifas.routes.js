import { Router } from 'express';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { tarifasSchema } from '../../Frontend/src/validations/TarifasSchema.js';
import { getTarifas, getTarifa, createTarifa, deleteTarifa, updateTarifa } from './tarifas.controllers.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';

const router = Router();

router.get('/Tarifas', asyncHandler(getTarifas));

router.get('/Tarifa/:id', asyncHandler(getTarifa));

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
  validateBody(tarifasSchema),
  asyncHandler(updateTarifa)
);

router.delete('/Tarifa/:id', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(deleteTarifa));

export const tarifasRoutes = router;
