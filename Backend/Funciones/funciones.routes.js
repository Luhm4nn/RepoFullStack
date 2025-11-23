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
  getFuncionesSemana,
} from './funciones.controllers.js';

import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { funcionesSchema } from '../validations/FuncionesSchema.js';
const router = Router();

router.get('/Funciones/:idPelicula/semana', asyncHandler(getFuncionesSemana));

router.get('/Funciones', asyncHandler(getFunciones));

router.get('/Funcion/:idSala/:fechaHoraFuncion', asyncHandler(getFuncion));

router.post('/Funcion', validateBody(funcionesSchema), asyncHandler(createFuncion));

router.put(
  '/Funcion/:idSala/:fechaHoraFuncion',
  validateBody(funcionesSchema),
  asyncHandler(updateFuncion)
);

router.delete('/Funcion/:idSala/:fechaHoraFuncion', asyncHandler(deleteFuncion));

router.get('/Funciones/activas', asyncHandler(getActiveFuncionesEndpoint));

router.get('/Funciones/inactivas', asyncHandler(getInactiveFuncionesEndpoint));

router.get('/Funciones/:idPelicula/:fecha', asyncHandler(getFuncionesByPeliculaAndFecha));

export const funcionesRoutes = router;
