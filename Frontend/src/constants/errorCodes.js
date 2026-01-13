/**
 * Constantes para codigos de error de validacion del sistema
 * Estos codigos corresponden a errores que deben ser manejados con modales especificos
 */

// Errores de Funciones
export const SOLAPAMIENTO_FUNCIONES = 'SOLAPAMIENTO_FUNCIONES';
export const FECHA_ESTRENO_INVALIDA = 'FECHA_ESTRENO_INVALIDA';

// Errores de Peliculas
export const FECHA_ESTRENO = 'FECHA_ESTRENO';

// Errores de Salas

// Errores de Tarifas

// Errores de Parametros




export const ERROR_METADATA = {
  // Errores de Funciones
  [SOLAPAMIENTO_FUNCIONES]: {
    title: 'Conflicto de Horarios',
    description: 'Por favor, selecciona un horario diferente que no se solape con otras funciones.'
  },
  [FECHA_ESTRENO_INVALIDA]: {
    title: 'Fecha de Estreno Invalida',
    description: 'Por favor, selecciona una fecha de funcion posterior a la fecha de estreno de la pelicula.'
  },
  
  // Errores de Peliculas
  [FECHA_ESTRENO]: {
    title: 'Fecha de Estreno Invalida',
    description: 'Por favor, selecciona una fecha de estreno valida, o ajuste las funciones programadas.'
  },
  
};

export const getErrorMetadata = (errorCode) => {
  return ERROR_METADATA[errorCode] || {
    title: 'Error',
    description: 'Ha ocurrido un error. Por favor, revisa los datos e intentalo nuevamente.'
  };
};

export const ERROR_CODES = [
  // Funciones
  SOLAPAMIENTO_FUNCIONES,
  FECHA_ESTRENO_INVALIDA,
  
  // Peliculas
  FECHA_ESTRENO,
];
