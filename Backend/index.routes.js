import { Router } from 'express';
import prisma from './prisma/prisma.js';
import { peliculasRoutes } from './Peliculas/peliculas.routes.js';
import { salasRoutes } from './Salas/salas.routes.js';
import { tarifasRoutes } from './Tarifas/tarifas.routes.js';
import { parametrosRoutes } from './Parametros/parametros.routes.js';
import { funcionesRoutes } from './Funciones/funciones.routes.js';
import { usuariosRoutes } from './Usuario/usuarios.routes.js';
import { authRoutes } from './Auth/auth.routes.js';
import { asientosRoutes } from './Salas/asientos.routes.js';
import { reservasRoutes } from './Funciones/reservas.routes.js';
import { asientoReservasRoutes } from './Funciones/asientoreservas.routes.js';
import { mercadopagoRoutes } from './Mercadopago/mercadopago.routes.js';
import { qrRoutes } from './Funciones/qr.routes.js';
import { reportesRoutes } from './Reportes/reportes.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date(),
      db: 'ok',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      uptime: process.uptime(),
      timestamp: new Date(),
      db: 'error',
    });
  }
});

router.use(peliculasRoutes);
router.use(salasRoutes);
router.use(tarifasRoutes);
router.use(parametrosRoutes);
router.use(funcionesRoutes);
router.use(usuariosRoutes);
router.use('/auth', authRoutes);
router.use(asientosRoutes);
router.use(reservasRoutes);
router.use(asientoReservasRoutes);
router.use(mercadopagoRoutes);
router.use(qrRoutes);
router.use(reportesRoutes);

export { router as indexRoutes };
export default router;
