import api from './axiosInstance.js';

/**
 * Valida un código QR escaneado
 * @param {string} encryptedData - Datos encriptados del QR
 * @returns {Promise<Object>} Resultado de la validación
 */
export const validateQR = async (encryptedData) => {
  try {
    const response = await api.post('/qr/validate', { encryptedData });
    return response.data;
  } catch (error) {
    throw error;
  }
};
