import rateLimit from 'express-rate-limit';

const skipIfDev = () => process.env.NODE_ENV !== 'production';

/**
 * Limitador para intentos de inicio de sesión.
 * Permite 5 intentos por minuto.
 */
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: skipIfDev,
});

/**
 * Limitador para creación de cuentas.
 * Permite 3 registros por hora.
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Demasiados intentos de registro desde esta IP. Por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

/**
 * Limitador general para la API.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

/**
 * Limitador estricto para rutas sensibles.
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Has excedido el límite de peticiones. Intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

/**
 * Limitador moderado para exploradores de contenido.
 */
export const moderateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: 'Has excedido el límite de peticiones. Intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});