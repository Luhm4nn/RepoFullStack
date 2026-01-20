import { generateReservaQR as generateReservaQRService } from './qr.service.js';

/**
 * Genera un código QR para una reserva específica
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const generateReservaQR = async (req, res) => {
    const qrData = await generateReservaQRService(req.params, req.user);
    res.json(qrData);
};
