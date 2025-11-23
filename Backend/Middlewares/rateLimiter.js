import rateLimit from 'express-rate-limit';

//middleware para limitar el numero de peticiones

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Demasiados intentos de registro desde esta IP. Por favor intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Has excedido el límite de peticiones. Intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});
