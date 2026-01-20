import { validateAndUseQR as validateAndUseQRService } from './qr-validation.service.js';

/**
 * Valida un código QR escaneado
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const validateQR = async (req, res) => {
    const { encryptedData } = req.body;
    const result = await validateAndUseQRService(encryptedData, req.user);
    res.json(result);
};
