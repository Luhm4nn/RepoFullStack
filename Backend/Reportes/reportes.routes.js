import { Router } from 'express';
import * as reportesController from './reportes.controller.js';

const router = Router();

router.get('/reportes/stats', reportesController.getDashboardStats);
router.get('/reportes/ventas-mensuales', reportesController.getVentasMensuales);
router.get('/reportes/asistencia-reservas', reportesController.getAsistenciaReservas);
router.get('/reportes/ocupacion-salas', reportesController.getOcupacionSalas);
router.get('/reportes/peliculas-mas-reservadas', reportesController.getPeliculasMasReservadas);
router.get('/reportes/ranking-cartelera', reportesController.getRankingPeliculasCartelera);

export const reportesRoutes = router;
