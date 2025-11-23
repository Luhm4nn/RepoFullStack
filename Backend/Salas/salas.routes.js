import { Router } from 'express';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { validateBody } from '../Middlewares/validateRequest.js';
import { salasSchema, salasUpdateSchema } from '../validations/SalasSchema.js';
import { getSalas, getSala, createSala, deleteSala, updateSala } from './salas.controllers.js';

const router = Router();

router.get('/Salas', asyncHandler(getSalas));

router.get('/Sala/:param', asyncHandler(getSala));

router.post('/Sala', validateBody(salasSchema), asyncHandler(createSala));

router.put('/Sala/:id', validateBody(salasUpdateSchema), asyncHandler(updateSala));

router.delete('/Sala/:id', asyncHandler(deleteSala));

export const salasRoutes = router;
