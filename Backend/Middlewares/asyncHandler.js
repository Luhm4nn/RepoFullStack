/**
 * Middleware para capturar errores en funciones asíncronas y pasarlos al manejador de errores global.
 * Evita el uso repetitivo de bloques try-catch en los controladores.
 * 
 * @param {Function} fn - Función asíncrona (controlador) a ejecutar.
 * @returns {Function} Middleware de Express que resuelve la promesa o captura el error.
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
