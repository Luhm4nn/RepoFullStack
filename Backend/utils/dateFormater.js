/**
 * Formatea una fecha para mensajes de error o visualización básica (DD/MM/YYYY).
 * 
 * @param {string|Date} dateString - La fecha a formatear.
 * @returns {string} Fecha formateada o mensaje de error.
 */
export const formatDateForBackendMessage = (dateString) => {
  if (!dateString) return 'Sin fecha';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha y hora para mensajes detallados (DD/MM/YYYY HH:MM).
 * 
 * @param {string|Date} dateString - La fecha/hora a formatear.
 * @returns {string} Fecha y hora formateada o mensaje de error.
 */
export const formatDateTimeForBackendMessage = (dateString) => {
  if (!dateString) return 'Sin fecha';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
