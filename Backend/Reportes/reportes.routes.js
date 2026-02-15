import { Router } from 'express';
import * as reportesController from './reportes.controller.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';

const router = Router();

// Rutas de reportes estadísticos y dashboard (ADMIN)
router.get('/reportes/stats', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getDashboardStats));
router.get('/reportes/ventas-mensuales', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getVentasMensuales));
router.get('/reportes/asistencia-reservas', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getAsistenciaReservas));
router.get('/reportes/ocupacion-salas', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getOcupacionSalas));
router.get('/reportes/peliculas-mas-reservadas', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getPeliculasMasReservadas));
router.get('/reportes/ranking-cartelera', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(reportesController.getRankingPeliculasCartelera));

export const reportesRoutes = router;
