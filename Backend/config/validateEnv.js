import logger from '../utils/logger.js';

/**
 * Valida que todas las variables de entorno requeridas estén presentes en el sistema.
 * Se ejecuta al inicio de la aplicación para prevenir fallos en tiempo de ejecución.
 *
 * @throws {Error} Si falta alguna variable crítica definida en 'requiredEnvVars'.
 */
export const validateEnv = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'FRONTEND_URL',
    'BACKEND_URL',
    'MAILJET_API_KEY',
    'MAILJET_SECRET_KEY',
  ];

  const optionalEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'MERCADOPAGO_ACCESS_TOKEN',
  ];

  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\n` +
        `Asegúrate de tener un archivo .env con todas las variables necesarias.\n` +
        `Puedes usar .env.example como referencia.`
    );
  }

  const missingOptional = optionalEnvVars.filter((varName) => !process.env[varName]);
  if (missingOptional.length > 0 && process.env.NODE_ENV !== 'test') {
    logger.warn(
      `Variables de entorno opcionales no configuradas:\n${missingOptional.map((v) => `  - ${v}`).join('\n')}\n` +
        `Algunas funcionalidades podrían no estar disponibles.`
    );
  }
};
