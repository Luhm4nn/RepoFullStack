import { Router } from 'express';
import {
  getAsientoReservas,
  getAsientoReserva,
  createAsientoReserva,
  updateAsientoReserva,
  deleteAsientoReserva,
  getAsientosReservadosByFuncion,
} from './asientoreservas.controllers.js';

import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { strictLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();
router.get('/AsientoReservas', asyncHandler(getAsientoReservas));

router.get('/AsientoReservas/:idSala/:fechaHoraFuncion', asyncHandler(getAsientosReservadosByFuncion));

router.get(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento',
  asyncHandler(getAsientoReserva)
);

router.post('/AsientoReserva', authMiddleware, strictLimiter, asyncHandler(createAsientoReserva));

router.put(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento',
  authMiddleware,
  asyncHandler(updateAsientoReserva)
);

router.delete(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento',
  authMiddleware,
  asyncHandler(deleteAsientoReserva)
);

export const asientoReservasRoutes = router;
