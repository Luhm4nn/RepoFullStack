import { Router } from 'express';
import { createPaymentPreference, handleWebhook } from './mercadopago.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { strictLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

router.post(
  '/mercadopago/create-preference',
  authMiddleware,
  strictLimiter,
  asyncHandler(createPaymentPreference)
);
router.post('/mercadopago/webhooks', asyncHandler(handleWebhook));

export const mercadopagoRoutes = router;
