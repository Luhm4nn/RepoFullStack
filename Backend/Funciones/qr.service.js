import QRCode from 'qrcode';
import * as repository from './qr.repository.js';
import { encryptData } from '../utils/qrEncryption.js';
import logger from '../utils/logger.js';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
 */
function validateOwnership(user, targetDNI) {
    logger.debug('=== VALIDATE OWNERSHIP (QR) ===');
    logger.debug('User:', user);
    logger.debug('Target DNI:', targetDNI);

    if (user.rol === 'ADMIN') {
        logger.debug('Usuario es ADMIN, acceso permitido');
        return;
    }

    if (user.id !== parseInt(targetDNI)) {
        logger.error('Acceso denegado: user.id !== targetDNI', {
            userId: user.id,
            targetDNI: parseInt(targetDNI),
        });
        const error = new Error('No puedes acceder a recursos de otros usuarios');
        error.status = 403;
        throw error;
    }

    logger.debug('Validación exitosa: usuario es dueño del recurso');
}

/**
 * Genera un código QR para una reserva
 * @param {Object} params - Parámetros de la reserva
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Objeto con el QR code en formato data URL
 */
export async function generateReservaQR(params, user) {
    const { DNI } = params;

    // Validar ownership
    validateOwnership(user, DNI);

    // Obtener reserva con todos los detalles
    const reserva = await repository.getReservaWithDetails(params);

    if (!reserva) {
        const error = new Error('Reserva no encontrada.');
        error.status = 404;
        throw error;
    }

    // Construir payload con datos mínimos para validación
    // Solo IDs necesarios para buscar la reserva en BD
    const qrData = {
        idSala: reserva.idSala,
        fechaHoraFuncion: reserva.fechaHoraFuncion.toISOString(),
        DNI: reserva.DNI,
        fechaHoraReserva: reserva.fechaHoraReserva.toISOString(),
    };

    // Encriptar datos
    const encryptedData = encryptData(qrData);

    // Generar QR code como data URL
    const qrCodeDataURL = await QRCode.toDataURL(encryptedData, {
        errorCorrectionLevel: 'L',
        type: 'image/png',
        width: 400,
        margin: 1,
    });

    logger.info('QR code generado exitosamente para reserva', {
        idSala: reserva.idSala,
        fechaHoraFuncion: reserva.fechaHoraFuncion,
        DNI: reserva.DNI,
    });

    return {
        qrCode: qrCodeDataURL,
    };
}
