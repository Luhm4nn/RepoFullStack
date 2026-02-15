import cron from 'node-cron';
import prisma from '../prisma/prisma.js';
import logger from '../utils/logger.js';
import { ESTADOS_FUNCION, ESTADOS_RESERVA } from '../constants/index.js';

/**
 * Inicializa los procesos en segundo plano (Cron Jobs) para el mantenimiento de funciones.
 * Se encarga de finalizar funciones antiguas y actualizar el estado de las reservas.
 * No se ejecuta en entorno de tests.
 */
export const iniciarCronFunciones = () => {
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
    logger.info('Skipping cron job initialization in test environment');
    return;
  }

  // Se ejecuta cada 2 horas
  cron.schedule('*/120 * * * *', async () => {
    try {
      const ahora = new Date();
      const dentro24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

      const funciones = await prisma.funcion.findMany({
        where: {
          estado: { not: ESTADOS_FUNCION.INACTIVA },
          fechaHoraFuncion: {
            lte: dentro24Horas,
          },
        },
        include: {
          pelicula: true,
          reserva: {
            where: {
              estado: ESTADOS_RESERVA.ACTIVA
            }
          },
        },
      });

      let funcionesActualizadas = 0;

      for (const funcion of funciones) {
        const fechaFin = new Date(
          funcion.fechaHoraFuncion.getTime() + funcion.pelicula.duracion * 60000
        );
        
        // Si la función ya terminó
        if (ahora > fechaFin) {
          await prisma.funcion.update({
            where: {
              idSala_fechaHoraFuncion: {
                idSala: funcion.idSala,
                fechaHoraFuncion: funcion.fechaHoraFuncion,
              },
            },
            data: { estado: ESTADOS_FUNCION.INACTIVA },
          });

          funcionesActualizadas++;
          
          // Marcar reservas activas como NO_ASISTIDA si la función terminó y no se validaron
          for (const reserva of funcion.reserva) {
            await prisma.reserva.update({
              where: {
                idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
                  idSala: reserva.idSala,
                  fechaHoraFuncion: reserva.fechaHoraFuncion,
                  DNI: reserva.DNI,
                  fechaHoraReserva: reserva.fechaHoraReserva,
                },
              },
              data: { estado: ESTADOS_RESERVA.NO_ASISTIDA },
            });
          }
          
          if (funcion.reserva.length > 0) {
            logger.info(`Finalizadas ${funcion.reserva.length} reservas de la función: ${funcion.pelicula.nombrePelicula}`);
          }
        }
      }

      if (funcionesActualizadas > 0) {
        logger.info(`${funcionesActualizadas} funciones marcadas como INACTIVA`);
      }
    } catch (error) {
      logger.error('Error en cron de funciones:', error);
    }
  });

  logger.info('Cron job de funciones iniciado - frecuencia: 2 horas');
};
