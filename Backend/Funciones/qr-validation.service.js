import * as repository from './qr.repository.js';
import { decryptData } from '../utils/qrEncryption.js';
import logger from '../utils/logger.js';
import { ESTADOS_RESERVA } from '../constants/index.js';

/**
 * Valida un código QR y marca la reserva como asistida
 * @param {string} encryptedData - Datos encriptados del QR
 * @param {Object} user - Usuario que escanea (debe ser ESCANER o ADMIN)
 * @returns {Promise<Object>} Resultado de la validación
 */
export async function validateAndUseQR(encryptedData, user) {
  logger.info('=== VALIDATING QR CODE ===', { user: user.id, rol: user.rol });

  try {
    // Desencriptar datos del QR
    const qrData = decryptData(encryptedData);
    logger.debug('QR data decrypted:', qrData);

    // Los datos ahora están directamente en el root del objeto
    if (
      !qrData ||
      !qrData.idSala ||
      !qrData.fechaHoraFuncion ||
      !qrData.DNI ||
      !qrData.fechaHoraReserva
    ) {
      const error = new Error('Datos de QR inválidos o incompletos');
      error.status = 400;
      throw error;
    }

    const params = {
      idSala: qrData.idSala,
      fechaHoraFuncion: qrData.fechaHoraFuncion,
      DNI: qrData.DNI,
      fechaHoraReserva: qrData.fechaHoraReserva,
    };

    // Obtener reserva actual de la base de datos
    const reserva = await repository.getReservaWithDetails(params);
    const ahora = new Date();

    if (!reserva) {
      const error = new Error('Reserva no encontrada');
      error.status = 404;
      throw error;
    }

    // Validar que la función ya haya comenzado o este a 15 minutos de comenzar y que no haya finalizado
    const quinceMinutosAntes = new Date(reserva.funcion.fechaHoraFuncion);
    quinceMinutosAntes.setMinutes(quinceMinutosAntes.getMinutes() - 15);
    if (quinceMinutosAntes > ahora) {
      const error = new Error('La función aún no ha comenzado');
      error.status = 400;
      error.code = 'FUNCTION_NOT_STARTED';
      throw error;
    }
    const horaDeFinalizacion = new Date(reserva.funcion.fechaHoraFuncion);
    horaDeFinalizacion.setMinutes(
      horaDeFinalizacion.getMinutes() + reserva.funcion.pelicula.duracion
    );
    if (horaDeFinalizacion < ahora) {
      const error = new Error('La función ya ha finalizado');
      error.status = 400;
      error.code = 'FUNCTION_ALREADY_ENDED';
      throw error;
    }

    // Validar estado de la reserva
    if (reserva.estado === ESTADOS_RESERVA.ASISTIDA) {
      const error = new Error('Esta reserva ya fue utilizada');
      error.status = 400;
      error.code = 'ALREADY_USED';
      throw error;
    }

    if (reserva.estado === ESTADOS_RESERVA.CANCELADA) {
      const error = new Error('Esta reserva fue cancelada');
      error.status = 400;
      error.code = 'RESERVATION_CANCELLED';
      throw error;
    }

    if (reserva.estado !== ESTADOS_RESERVA.ACTIVA) {
      const error = new Error('Esta reserva no está activa');
      error.status = 400;
      error.code = 'NOT_ACTIVE';
      throw error;
    }

    // Marcar reserva como asistida
    const updatedReserva = await repository.markReservaAsUsed(params);

    logger.info('Reserva marcada como ASISTIDA exitosamente', {
      idSala: params.idSala,
      DNI: params.DNI,
      escaneadoPor: user.id,
    });

    return {
      success: true,
      message: 'Reserva validada y marcada como asistida',
      reserva: {
        idSala: updatedReserva.idSala,
        DNI: updatedReserva.DNI,
        pelicula: updatedReserva.funcion.pelicula.nombrePelicula,
        sala: updatedReserva.funcion.sala.nombreSala,
        fechaHoraFuncion: updatedReserva.funcion.fechaHoraFuncion,
        cliente: `${updatedReserva.usuario.nombreUsuario} ${updatedReserva.usuario.apellidoUsuario}`,
        estado: updatedReserva.estado,
      },
    };
  } catch (error) {
    logger.error('Error validating QR:', error.message);
    throw error;
  }
}
