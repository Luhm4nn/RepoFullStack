import { Router } from 'express';
import { generateReservaQR } from './qr.controllers.js';
import { validateQR } from './qr-validation.controller.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { moderateLimiter } from '../Middlewares/rateLimiter.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { qrValidationSchema } from '../validations/QRValidationSchema.js';

const router = Router();

// Ruta protegida para generar QR de reserva
router.get(
    '/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/qr',
    authMiddleware,
    moderateLimiter,
    asyncHandler(generateReservaQR)
);

// Ruta protegida para validar QR (solo ESCANER y ADMIN)
router.post(
    '/qr/validate',
    authMiddleware,
    authorizeRoles('ESCANER', 'ADMIN'),
    moderateLimiter,
    validateBody(qrValidationSchema),
    asyncHandler(validateQR)
);

export const qrRoutes = router;
