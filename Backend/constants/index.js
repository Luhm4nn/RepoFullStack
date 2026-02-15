/**
 * Constantes globales del proyecto backend
 */

// Generos de peliculas
export const GENEROS_PELICULAS = [
  { value: 'ACCION', label: 'Acción' },
  { value: 'AVENTURA', label: 'Aventura' },
  { value: 'COMEDIA', label: 'Comedia' },
  { value: 'DRAMA', label: 'Drama' },
  { value: 'TERROR', label: 'Terror' },
  { value: 'CIENCIA_FICCION', label: 'Ciencia Ficción' },
  { value: 'FANTASIA', label: 'Fantasía' },
  { value: 'ANIMACION', label: 'Animación' },
  { value: 'ROMANCE', label: 'Romance' },
  { value: 'SUSPENSO', label: 'Suspenso' },
  { value: 'DOCUMENTAL', label: 'Documental' },
];

// Clasificaciones MPAA (Motion Picture Association of America)
export const CLASIFICACIONES_MPAA = [
  { value: 'G', label: 'G - Apto para toda la familia', description: 'General Audiences' },
  {
    value: 'PG',
    label: 'PG - Se recomienda supervisión parental',
    description: 'Parental Guidance Suggested',
  },
  {
    value: 'PG-13',
    label: 'PG-13 - Mayores de 13 años',
    description: 'Parents Strongly Cautioned',
  },
  { value: 'R', label: 'R - Restringida (menores acompañados)', description: 'Restricted' },
  { value: 'NC-17', label: 'NC-17 - Solo para adultos (+18)', description: 'Adults Only' },
];

// Estados de funciones
export const ESTADOS_FUNCION = {
  PRIVADA: 'PRIVADA',
  PUBLICA: 'PUBLICA',
  INACTIVA: 'INACTIVA',
};

// Estados de reservas
export const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  ACTIVA: 'ACTIVA',
  CANCELADA: 'CANCELADA',
  ASISTIDA: 'ASISTIDA',
  NO_ASISTIDA: 'NO_ASISTIDA',
};

// Meses del año abreviados para reportes
export const MESES_ABREVIADOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];
