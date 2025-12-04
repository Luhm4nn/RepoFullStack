import { Router } from 'express';
import {
  getReservas,
  getReserva,
  createReserva,
  cancellReserva,
  deleteReserva,
  getLatestReservas
} from './reservas.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { strictLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

router.get('/Reservas', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(getReservas));

router.get("/Reservas/latest", asyncHandler(getLatestReservas));

router.get(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  asyncHandler(getReserva)
);

router.post('/Reserva', authMiddleware, strictLimiter, asyncHandler(createReserva));

router.put(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  asyncHandler(cancellReserva)
);

router.delete(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(deleteReserva)
);


export const reservasRoutes = router;
