import { Router } from 'express';
import {
  getParametros,
  getParametro,
  createParametro,
  deleteParametro,
  updateParametro,
} from './parametros.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { parametrosSchema } from '../validations/ParametrosSchema.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
const router = Router();

router.get('/Parametros', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(getParametros));

router.get('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(getParametro));

router.post('/Parametro', authMiddleware, authorizeRoles('ADMIN'), validateBody(parametrosSchema), asyncHandler(createParametro));

router.put('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), validateBody(parametrosSchema), asyncHandler(updateParametro));

router.delete('/Parametro/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(deleteParametro));

export const parametrosRoutes = router;
