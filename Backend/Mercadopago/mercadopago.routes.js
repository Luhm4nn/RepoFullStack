import { Router } from 'express';
import { createPaymentPreference, handleWebhook } from './mercadopago.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';

const router = Router();

router.post('/mercadopago/create-preference', asyncHandler(createPaymentPreference));
router.post('/mercadopago/webhooks', asyncHandler(handleWebhook));

export const mercadopagoRoutes = router;
