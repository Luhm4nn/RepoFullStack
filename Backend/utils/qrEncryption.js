import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Gets a properly formatted 32-byte encryption key
 * @returns {Buffer} 32-byte key buffer
 */
function getEncryptionKey() {
    const keyString = process.env.QR_ENCRYPTION_KEY || 'default-secret-key-for-qr-codes';

    // Create a 32-byte key using SHA-256 hash
    return crypto.createHash('sha256').update(keyString).digest();
}

/**
 * Encrypts data to be embedded in QR code
 * @param {Object} data - Data object to encrypt
 * @returns {string} Encrypted base64 string
 */
export function encryptData(data) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = getEncryptionKey();
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const jsonString = JSON.stringify(data);
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Combine IV and encrypted data
        const combined = iv.toString('hex') + ':' + encrypted;
        return Buffer.from(combined).toString('base64');
    } catch (error) {
        throw new Error(`Error encrypting data: ${error.message}`);
    }
}

/**
 * Decrypts data from QR code
 * @param {string} encryptedData - Base64 encrypted string
 * @returns {Object} Decrypted data object
 */
export function decryptData(encryptedData) {
    try {
        const combined = Buffer.from(encryptedData, 'base64').toString('utf8');
        const parts = combined.split(':');

        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const key = getEncryptionKey();

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error(`Error decrypting data: ${error.message}`);
    }
}
