/**
 * Constantes para códigos de error de validación del sistema
 * Estos códigos corresponden a errores que deben ser manejados con modales específicos
 */

// Errores de Funciones
export const SOLAPAMIENTO_FUNCIONES = 'SOLAPAMIENTO_FUNCIONES';
export const FECHA_ESTRENO_INVALIDA = 'FECHA_ESTRENO_INVALIDA';

// Errores de Películas
export const FECHA_ESTRENO = 'FECHA_ESTRENO';

// Errores de Salas

// Errores de Tarifas

// Errores de Parámetros




export const ERROR_METADATA = {
  // Errores de Funciones
  [SOLAPAMIENTO_FUNCIONES]: {
    title: 'Conflicto de Horarios',
    description: 'Por favor, selecciona un horario diferente que no se solape con otras funciones.'
  },
  [FECHA_ESTRENO_INVALIDA]: {
    title: 'Fecha de Estreno Inválida',
    description: 'Por favor, selecciona una fecha de función posterior a la fecha de estreno de la película.'
  },
  
  // Errores de Películas
  [FECHA_ESTRENO]: {
    title: 'Fecha de Estreno Inválida',
    description: 'Por favor, selecciona una fecha de estreno válida, o ajuste las funciones programadas.'
  },
  
};

export const getErrorMetadata = (errorCode) => {
  return ERROR_METADATA[errorCode] || {
    title: 'Error',
    description: 'Ha ocurrido un error. Por favor, revisa los datos e inténtalo nuevamente.'
  };
};

export const ERROR_CODES = [
  // Funciones
  SOLAPAMIENTO_FUNCIONES,
  FECHA_ESTRENO_INVALIDA,
  
  // Películas
  FECHA_ESTRENO,

];
