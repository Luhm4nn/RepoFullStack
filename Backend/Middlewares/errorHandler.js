import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

/**
 * Manejador global de errores para la aplicación.
 * Captura errores de Prisma, errores 404 y cualquier otra excepción no controlada.
 * 
 * @param {Object} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware (no utilizada aquí).
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      logger.warn('Prisma error: Unique constraint violation');
      return res.status(409).json({
        message: 'Ya existe un registro con esos datos.',
      });
    }
    if (err.code === 'P2003') {
      logger.warn('Prisma error: Foreign key constraint failed');
      return res.status(400).json({
        message: 'El registro relacionado no existe o ya fue eliminado.',
      });
    }

    if (err.code === 'P2025') {
      logger.warn('Prisma error: Record not found');
      return res.status(404).json({ message: 'Registro no encontrado.' });
    }
  }

  if (err.status === 404) {
    logger.warn('404 error:', err.message);
    return res.status(404).json({ message: err.message });
  }

  logger.error('Internal server error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
}
