import { Router } from 'express';
import { generateReservaQR } from './qr.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { moderateLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

// Ruta protegida para generar QR de reserva
router.get(
    '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/qr',
    authMiddleware,
    moderateLimiter,
    asyncHandler(generateReservaQR)
);

export const qrRoutes = router;
