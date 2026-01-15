import * as repository from './qr.repository.js';
import { decryptData } from '../utils/qrEncryption.js';
import logger from '../utils/logger.js';

/**
 * Valida un código QR y marca la reserva como usada
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
        if (!qrData || !qrData.idSala || !qrData.fechaHoraFuncion ||
            !qrData.DNI || !qrData.fechaHoraReserva) {
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

        if (!reserva) {
            const error = new Error('Reserva no encontrada');
            error.status = 404;
            throw error;
        }

        // Validar estado de la reserva
        if (reserva.estado === 'USADA') {
            const error = new Error('Esta reserva ya fue utilizada');
            error.status = 400;
            error.code = 'ALREADY_USED';
            throw error;
        }

        if (reserva.estado === 'CANCELADA') {
            const error = new Error('Esta reserva fue cancelada');
            error.status = 400;
            error.code = 'CANCELLED';
            throw error;
        }

        // Marcar reserva como usada
        const updatedReserva = await repository.markReservaAsUsed(params);

        logger.info('Reserva marcada como USADA exitosamente', {
            idSala: params.idSala,
            DNI: params.DNI,
            escaneadoPor: user.id,
        });

        return {
            success: true,
            message: 'Reserva validada y marcada como usada',
            reserva: {
                idSala: updatedReserva.idSala,
                DNI: updatedReserva.DNI,
                estado: updatedReserva.estado,
                total: updatedReserva.total.toString(),
                pelicula: updatedReserva.funcion.pelicula.nombrePelicula,
                sala: updatedReserva.funcion.sala.nombreSala,
                fechaHoraFuncion: updatedReserva.funcion.fechaHoraFuncion,
                cliente: `${updatedReserva.usuario.nombreUsuario} ${updatedReserva.usuario.apellidoUsuario}`,
            },
        };
    } catch (error) {
        logger.error('Error validating QR:', error.message);
        throw error;
    }
}
