import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // Para AES, esto siempre es 16

/**
 * Obtiene una clave de encriptación de 32 bytes formateada correctamente.
 * Utiliza SHA-256 para asegurar que el buffer tenga el tamaño requerido por AES-256.
 * 
 * @returns {Buffer} Buffer de clave de 32 bytes.
 */
function getEncryptionKey() {
    const keyString = process.env.QR_ENCRYPTION_KEY || 'default-secret-key-for-qr-codes';

    // Crear una clave de 32 bytes usando el hash SHA-256
    return crypto.createHash('sha256').update(keyString).digest();
}

/**
 * Encripta un objeto de datos para ser embebido en un código QR.
 * Utiliza AES-256-CBC con un IV aleatorio.
 * 
 * @param {Object} data - Objeto de datos a encriptar.
 * @returns {string} Cadena en base64 que contiene el IV y los datos encriptados.
 */
export function encryptData(data) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = getEncryptionKey();
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const jsonString = JSON.stringify(data);
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Combinar IV y datos encriptados
        const combined = iv.toString('hex') + ':' + encrypted;
        return Buffer.from(combined).toString('base64');
    } catch (error) {
        throw new Error(`Error encriptando datos: ${error.message}`);
    }
}

/**
 * Desencripta los datos provenientes de un código QR.
 * 
 * @param {string} encryptedData - Cadena en base64 con el formato "IV:ENCRYPTED_DATA".
 * @returns {Object} Objeto de datos desencriptado.
 * @throws {Error} Si el formato es inválido o la desencriptación falla.
 */
export function decryptData(encryptedData) {
    try {
        const combined = Buffer.from(encryptedData, 'base64').toString('utf8');
        const parts = combined.split(':');

        if (parts.length !== 2) {
            throw new Error('Formato de datos encriptados inválido');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const key = getEncryptionKey();

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error(`Error desencriptando datos: ${error.message}`);
    }
}
