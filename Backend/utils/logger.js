/**
 * Secure Logger Utility
 * Previene la exposición de información sensible en producción
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Redacta información sensible de un mensaje
 */
const redactSensitiveInfo = (message) => {
  if (typeof message !== 'string') return message;

  return message
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '[EMAIL_REDACTED]')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
    .replace(/(password|contrasena|pwd|secret|token|key)[\s:=]+[^\s,}]+/gi, '$1: [REDACTED]');
};

/**
 * Logger seguro con niveles
 */
export const logger = {
  /**
   * Logs de información general (solo en desarrollo)
   */
  info: (...args) => {
    if (!isProd) {
      // ...existing code...
    }
  },

  /**
   * Logs de debugging (solo en desarrollo)
   */
  debug: (...args) => {
    if (!isProd) {
      // ...existing code...
    }
  },

  /**
   * Errores (siempre se registran, pero redactados en producción)
   */
  error: (...args) => {
    if (isProd) {
      const redactedArgs = args.map((arg) => {
        if (typeof arg === 'string') {
          return redactSensitiveInfo(arg);
        }
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}`;
        }
        return '[ERROR_DATA]';
      });
      console.error('[ERROR]', ...redactedArgs);
    } else {
      console.error('[ERROR]', ...args);
    }
  },

  /**
   * Warnings (siempre se registran)
   */
  warn: (...args) => {
    if (isProd) {
      const redactedArgs = args.map((arg) => (typeof arg === 'string' ? redactSensitiveInfo(arg) : arg));
      console.warn('[WARN]', ...redactedArgs);
    } else {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Eventos de seguridad (siempre se registran, pero SIN datos sensibles)
   * Usar para: intentos de login, cambios de permisos, etc.
   */
  security: (event, metadata = {}) => {
    const timestamp = new Date().toISOString();
    const safeMetadata = {
      timestamp,
      event,
      userRole: metadata.userRole || 'unknown',
      action: metadata.action || 'unknown',
      resource: metadata.resource || 'unknown',
      success: metadata.success !== undefined ? metadata.success : null,
    };

    // ...existing code...
  },

  /**
   * HTTP requests (solo en desarrollo, resumido en producción)
   */
  http: (method, path, statusCode, duration) => {
    if (!isProd) {
      // ...existing code...
    } else {
      if (statusCode >= 400) {
        // ...existing code...
      }
    }
  },

  /**
   * Éxito de operaciones importantes (resumido en producción)
   */
  success: (message, details = {}) => {
    if (!isProd) {
      // ...existing code...
    } else {
      // ...existing code...
    }
  },
};

export default logger;
