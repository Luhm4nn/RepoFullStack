/**
 * Constantes globales del proyecto backend
 */

// Generos de peliculas
export const GENEROS_PELICULAS = [
  { value: 'Accion', label: 'Accion' },
  { value: 'Aventura', label: 'Aventura' },
  { value: 'Comedia', label: 'Comedia' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Terror', label: 'Terror' },
  { value: 'Ciencia ficcion', label: 'Ciencia ficcion' },
  { value: 'Fantasia', label: 'Fantasia' },
  { value: 'Animacion', label: 'Animacion' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Suspenso', label: 'Suspenso' },
  { value: 'Documental', label: 'Documental' },
];

// Clasificaciones MPAA (Motion Picture Association of America)
export const CLASIFICACIONES_MPAA = [
  { value: 'G', label: 'G - Apto para toda la familia', description: 'General Audiences' },
  {
    value: 'PG',
    label: 'PG - Se recomienda supervision parental',
    description: 'Parental Guidance Suggested',
  },
  {
    value: 'PG-13',
    label: 'PG-13 - Mayores de 13 anos',
    description: 'Parents Strongly Cautioned',
  },
  { value: 'R', label: 'R - Restringida (menores acompanados)', description: 'Restricted' },
  { value: 'NC-17', label: 'NC-17 - Solo para adultos (+18)', description: 'Adults Only' },
];

// Estados de funciones
export const ESTADOS_FUNCION = {
  PUBLICA: 'Publica',
  PRIVADA: 'Privada',
  INACTIVA: 'Inactiva',
};

// Estados de reservas
export const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  ACTIVA: 'ACTIVA',
  CANCELADA: 'CANCELADA',
  ASISTIDA: 'ASISTIDA',
  NO_ASISTIDA: 'NO_ASISTIDA',
};
