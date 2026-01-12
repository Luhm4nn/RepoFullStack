import cron from 'node-cron';
import prisma from '../prisma/prisma.js';
import logger from '../utils/logger.js';

/**
 * Inicia el cron job para actualizar estados de funciones
 */
export const iniciarCronFunciones = () => {
  // No iniciar cron en ambiente de testing
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
    logger.info('Skipping cron job initialization in test environment');
    return;
  }

  // Corre cada 1 minuto para verificar funciones finalizadas
  cron.schedule("*/1 * * * *", async () => {
    try {
      const ahora = new Date();
      // logger.debug(`[${ahora.toISOString()}] Verificando funciones finalizadas...`); // Reduced noise

      // date range filter
      const hace100Horas = new Date(ahora.getTime() - 100 * 60 * 60 * 1000);
      const dentro24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

      const funciones = await prisma.funcion.findMany({
        where: {
          estado: { not: 'Inactiva' },
          fechaHoraFuncion: {
            gte: hace100Horas,
            lte: dentro24Horas,
          },
        },
        include: {
          pelicula: true,
        },
      });

      let funcionesActualizadas = 0;

      for (const funcion of funciones) {
        const fechaFin = new Date(
          funcion.fechaHoraFuncion.getTime() + funcion.pelicula.duracion * 60000
        );

        // if pelicula ended changes estado to Inactiva
        if (ahora > fechaFin) {
          await prisma.funcion.update({
            where: {
              idSala_fechaHoraFuncion: {
                idSala: funcion.idSala,
                fechaHoraFuncion: funcion.fechaHoraFuncion,
              },
            },
            data: { estado: 'Inactiva' },
          });

          funcionesActualizadas++;
          logger.info(
            `Función finalizada: ${funcion.pelicula.nombrePelicula} - Sala ${funcion.idSala} - ${funcion.fechaHoraFuncion.toLocaleString()}`
          );
        }
      }

      if (funcionesActualizadas > 0) {
        logger.info(`${funcionesActualizadas} función(es) marcada(s) como Inactiva`);
      }
    } catch (error) {
      logger.error('Error en cron de funciones:', error);
    }
  });

  logger.info('Cron job de funciones iniciado - se ejecuta cada 1 minuto');
};
