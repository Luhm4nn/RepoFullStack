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
