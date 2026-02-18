/**
 * Constantes globales del proyecto frontend
 *
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
  { value: 'G', label: 'G - Apto para toda la familia' },
  { value: 'PG', label: 'PG - Se recomienda supervisión parental' },
  { value: 'PG-13', label: 'PG-13 - Mayores de 13 años' },
  { value: 'R', label: 'R - Restringida (menores acompañados)' },
  { value: 'NC-17', label: 'NC-17 - Solo para adultos (+18)' },
];

// Estados de funciones
export const ESTADOS_FUNCION = {
  PUBLICA: 'PUBLICA',
  PRIVADA: 'PRIVADA',
  INACTIVA: 'INACTIVA',
};

export const ESTADOS_FUNCION_LABELS = {
  [ESTADOS_FUNCION.PUBLICA]: 'Pública',
  [ESTADOS_FUNCION.PRIVADA]: 'Privada',
  [ESTADOS_FUNCION.INACTIVA]: 'Inactiva',
};

// Estados de reservas
export const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  ACTIVA: 'ACTIVA',
  CANCELADA: 'CANCELADA',
  ASISTIDA: 'ASISTIDA',
  NO_ASISTIDA: 'NO_ASISTIDA',
};

export const ESTADOS_RESERVA_LABELS = {
  [ESTADOS_RESERVA.PENDIENTE]: 'Pendiente',
  [ESTADOS_RESERVA.ACTIVA]: 'Activa',
  [ESTADOS_RESERVA.CANCELADA]: 'Cancelada',
  [ESTADOS_RESERVA.ASISTIDA]: 'Asistida',
  [ESTADOS_RESERVA.NO_ASISTIDA]: 'No Asistida',
};

// Códigos de error del escáner QR
export const SCANNER_ERROR_CODES = {
  FUNCTION_NOT_STARTED: 'FUNCTION_NOT_STARTED',
  FUNCTION_ALREADY_ENDED: 'FUNCTION_ALREADY_ENDED',
  ALREADY_USED: 'ALREADY_USED',
  RESERVATION_CANCELLED: 'RESERVATION_CANCELLED',
};

export const SCANNER_ERROR_CONFIG = {
  [SCANNER_ERROR_CODES.FUNCTION_NOT_STARTED]: {
    title: 'Función Aún No Comenzó',
    colorClass: 'yellow',
  },
  [SCANNER_ERROR_CODES.FUNCTION_ALREADY_ENDED]: {
    title: 'Función Ya Finalizada',
    colorClass: 'orange',
  },
  [SCANNER_ERROR_CODES.ALREADY_USED]: {
    title: 'Reserva Ya Utilizada',
    colorClass: 'yellow',
  },
  [SCANNER_ERROR_CODES.RESERVATION_CANCELLED]: {
    title: 'Reserva Cancelada',
    colorClass: 'red',
  },
};

export const SCANNER_COLOR_CLASSES = {
  green: {
    bg: 'bg-green-500/20',
    icon: 'text-green-400',
    title: 'text-green-400',
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    icon: 'text-yellow-400',
    title: 'text-yellow-400',
  },
  orange: {
    bg: 'bg-orange-500/20',
    icon: 'text-orange-400',
    title: 'text-orange-400',
  },
  red: {
    bg: 'bg-red-500/20',
    icon: 'text-red-400',
    title: 'text-red-400',
  },
};
