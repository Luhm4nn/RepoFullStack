/**
 * Secure Logger Utility
 * Previene la exposición de información sensible en producción
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Redacta información sensible de un mensaje para evitar su filtración en logs.
 * 
 * @param {string} message - El mensaje a analizar.
 * @returns {string} El mensaje con información sensible reemplazada.
 */
const redactSensitiveInfo = (message) => {
  if (typeof message !== 'string') return message;

  return message
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '[EMAIL_REDACTED]')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
    .replace(/(password|contrasena|pwd|secret|token|key)[\s:=]+[^\s,}]+/gi, '$1: [REDACTED]');
};

/**
 * Utilitario de Logging seguro con multinivel.
 * Filtra verbosidad y redacta datos sensibles en entornos de producción.
 */
export const logger = {
  /**
   * Registra información general. Solo visible en desarrollo.
   */
  info: (...args) => {
    if (!isProd) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Logs de debugging (solo en desarrollo)
   */
  debug: (...args) => {
    if (!isProd) {
      console.debug('[DEBUG]', ...args);
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
   * Registra eventos de seguridad (auditoría). 
   * Diseñado para registrar acciones críticas sin exponer datos sensibles.
   * 
   * @param {string} event - Nombre del evento.
   * @param {Object} metadata - Información contextual no sensible.
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

  },

  /**
   * HTTP requests (solo en desarrollo, resumido en producción)
   */
  http: (method, path, statusCode, duration) => {
    if (!isProd) {
      console.log('[HTTP]', method, path, statusCode, `${duration}ms`);
    } else {
      if (statusCode >= 400) {
        console.warn('[HTTP]', method, path, statusCode, `${duration}ms`);
      }
    }
  },

  /**
   * Éxito de operaciones importantes (resumido en producción)
   */
  success: (message, details = {}) => {
    if (!isProd) {
      console.log('[SUCCESS]', message, details);
    } else {
      console.log('[SUCCESS]', message);
    }
  },
};

export default logger;
