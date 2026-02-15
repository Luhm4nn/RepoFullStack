import { Router } from 'express';
import {
  getReservas,
  getReserva,
  createReserva,
  cancelReserva,
  deleteReserva,
  deletePendingReserva,
  getLatestReservas,
  getUserReservas,
  confirmReserva
} from './reservas.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { strictLimiter, moderateLimiter } from '../Middlewares/rateLimiter.js';
import { validateBody, validateQuery } from '../Middlewares/validateRequest.js';
import { atomicReservaCreateSchema } from '../validations/ReservasSchema.js';
import { reservasFilterSchema } from '../validations/CommonSchemas.js';

const router = Router();

router.get('/Reservas/user', authMiddleware, moderateLimiter, validateQuery(reservasFilterSchema), asyncHandler(getUserReservas));

router.get('/Reservas', authMiddleware, authorizeRoles('ADMIN'), validateQuery(reservasFilterSchema), asyncHandler(getReservas));

router.get("/Reservas/latest", validateQuery(reservasFilterSchema), asyncHandler(getLatestReservas));

router.get(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  asyncHandler(getReserva)
);

router.post('/Reserva', authMiddleware, strictLimiter, validateBody(atomicReservaCreateSchema), asyncHandler(createReserva));

router.put(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  moderateLimiter,
  asyncHandler(cancelReserva)
);

router.delete(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(deleteReserva)
);

router.delete(
  '/Reserva/pending/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva',
  authMiddleware,
  asyncHandler(deletePendingReserva)
);

router.patch(
  '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/confirm',
  authMiddleware,
  moderateLimiter,
  asyncHandler(confirmReserva)
);


export const reservasRoutes = router;
