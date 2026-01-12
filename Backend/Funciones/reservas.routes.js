import { Router } from 'express';
import {
  getReservas,
  getReserva,
  createReserva,
  cancellReserva,
  deleteReserva,
  getLatestReservas,
  getUserReservas
} from './reservas.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { strictLimiter } from '../Middlewares/rateLimiter.js';
import { validateBody, validateQuery } from '../Middlewares/validateRequest.js';
import { reservaCreateSchema } from '../validations/ReservasSchema.js';
import { reservasFilterSchema } from '../validations/CommonSchemas.js';

const router = Router();

router.get('/Reservas/user', authMiddleware, validateQuery(reservasFilterSchema), asyncHandler(getUserReservas));

router.get('/Reservas', authMiddleware, authorizeRoles('ADMIN'), validateQuery(reservasFilterSchema), asyncHandler(getReservas));

router.get("/Reservas/latest", validateQuery(reservasFilterSchema), asyncHandler(getLatestReservas));

router.get(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  asyncHandler(getReserva)
);

router.post('/Reserva', authMiddleware, strictLimiter, validateBody(reservaCreateSchema), asyncHandler(createReserva));

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
