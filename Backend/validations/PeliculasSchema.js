import * as Yup from 'yup';
import xss from 'xss';
import { CLASIFICACIONES_MPAA, GENEROS_PELICULAS } from '../constants/index.js';

/**
 * Esquema de validación para películas.
 * Valida nombre, director, género, duración y otros detalles técnicos/metadatos.
 */
export const peliculaSchema = Yup.object().shape({
  nombrePelicula: Yup.string()
    .min(2, 'Muy corto')
    .max(100, 'Muy largo')
    .required('El nombre es requerido')
    .trim(),

  director: Yup.string()
    .min(2, 'Muy corto')
    .max(50, 'Muy largo')
    .required('El director es requerido')
    .trim(),

  generoPelicula: Yup.string()
    .required('El género es requerido')
    .oneOf(GENEROS_PELICULAS.map(g => g.value), 'Género inválido')
    .trim(),

  duracion: Yup.number()
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1 minuto')
    .max(500, 'Máximo 500 minutos')
    .required('La duración es requerida'),

  fechaEstreno: Yup.date().nullable(),

  sinopsis: Yup.string()
    .max(1000, 'Máximo 1000 caracteres')
    .trim()
    .transform((value) => value ? xss(value) : null)
    .nullable(),

  trailerURL: Yup.string()
    .url('Debe ser una URL válida')
    .trim()
    .transform((value) => value ? xss(value) : null)
    .nullable(),

  portada: Yup.mixed().nullable(),

  MPAA: Yup.string().oneOf(CLASIFICACIONES_MPAA.map(c => c.value), 'Clasificación inválida').nullable(),
});
