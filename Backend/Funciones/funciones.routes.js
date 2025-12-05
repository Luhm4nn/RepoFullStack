import { Router } from 'express';
import {
  getFunciones,
  getFuncion,
  createFuncion,
  updateFuncion,
  deleteFuncion,
  getActiveFuncionesEndpoint,
  getInactiveFuncionesEndpoint,
  getFuncionesByPeliculaAndFecha,
  getPublicFuncionesEndpoint,
  getFuncionesSemana,
  getCountPublicFunciones,
} from './funciones.controllers.js';

import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { funcionesSchema } from '../validations/FuncionesSchema.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';

const router = Router();

// Rutas públicas de lectura
router.get('/Funciones', asyncHandler(getFunciones));
router.get('/Funciones/activas', asyncHandler(getActiveFuncionesEndpoint));
router.get('/Funciones/publicas', asyncHandler(getPublicFuncionesEndpoint));
router.get('/Funciones/publicas/count', asyncHandler(getCountPublicFunciones));
router.get('/Funciones/:idPelicula/semana', asyncHandler(getFuncionesSemana));
router.get('/Funciones/:idPelicula/:fecha', asyncHandler(getFuncionesByPeliculaAndFecha));
router.get('/Funcion/:idSala/:fechaHoraFuncion', asyncHandler(getFuncion));

// Rutas protegidas (ADMIN)
router.get(
  '/Funciones/inactivas',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(getInactiveFuncionesEndpoint)
);

router.post(
  '/Funcion',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateBody(funcionesSchema),
  asyncHandler(createFuncion)
);

router.put(
  '/Funcion/:idSala/:fechaHoraFuncion',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateBody(funcionesSchema),
  asyncHandler(updateFuncion)
);

router.delete(
  '/Funcion/:idSala/:fechaHoraFuncion',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(deleteFuncion)
);

export const funcionesRoutes = router;
