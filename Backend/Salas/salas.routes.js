import { Router } from 'express';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody, validateQuery, validateParams } from '../Middlewares/validateRequest.js';
import { salasSchema, salasUpdateSchema } from '../validations/SalasSchema.js';
import { searchQuerySchema, idParamSchema, salaParamSchema } from '../validations/CommonSchemas.js';
import { getSalas, getSala, createSala, deleteSala, updateSala, getCountSalas, searchSalas } from './salas.controllers.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { moderateLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

router.get('/Salas', moderateLimiter, asyncHandler(getSalas));

router.get('/Salas/search', moderateLimiter, validateQuery(searchQuerySchema), asyncHandler(searchSalas));

router.get('/Salas/count', asyncHandler(getCountSalas));

router.get('/Sala/:param', validateParams(salaParamSchema), asyncHandler(getSala));

router.post(
  '/Sala',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateBody(salasSchema),
  asyncHandler(createSala)
);

router.put(
  '/Sala/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateBody(salasUpdateSchema),
  asyncHandler(updateSala)
);

router.delete('/Sala/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(deleteSala));

export const salasRoutes = router;
