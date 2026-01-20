import rateLimit from 'express-rate-limit';

// Función para determinar si se debe saltar el límite (solo en desarrollo)
const skipIfDev = () => process.env.NODE_ENV !== 'production';

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: skipIfDev,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Demasiados intentos de registro desde esta IP. Por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Has excedido el límite de peticiones. Intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});

export const moderateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: 'Has excedido el límite de peticiones. Intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfDev,
});