import * as Yup from 'yup';
import { ESTADOS_RESERVA, ESTADOS_FUNCION } from '../constants/index.js';

/**
 * Esquema de paginación reutilizable para queries.
 * Valida que page y limit sean números positivos y enteros.
 */
export const paginationSchema = Yup.object().shape({
  page: Yup.number()
    .positive('La página debe ser positiva')
    .integer('La página debe ser un número entero')
    .default(1)
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return 1;
      }
      return value;
    }),

  limit: Yup.number()
    .positive('El límite debe ser positivo')
    .integer('El límite debe ser un número entero')
    .max(100, 'El límite máximo es 100')
    .default(10)
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return 10;
      }
      return value;
    }),
});

/**
 * Esquema para búsqueda general.
 * Valida un término de búsqueda 'q' y parámetros de paginación.
 */
export const searchQuerySchema = Yup.object().shape({
  q: Yup.string().trim().max(100, 'El término de búsqueda es demasiado largo').nullable(),

  limit: Yup.number()
    .positive('El límite debe ser positivo')
    .integer('El límite debe ser un número entero')
    .max(100, 'El límite máximo es 100')
    .default(10)
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return 10;
      }
      return value;
    }),
});

/**
 * Esquema de filtrado para funciones de cine.
 * Incluye filtros por película, sala, fechas y paginación.
 */
export const funcionesFilterSchema = Yup.object().shape({
  estado: Yup.string()
    .transform((value) => (value ? value.toUpperCase() : value))
    .nullable(),

  idPelicula: Yup.number()
    .positive('El ID de película debe ser positivo')
    .integer('El ID de película debe ser un número entero')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  nombrePelicula: Yup.string().trim().max(100).nullable(),

  idSala: Yup.number()
    .positive('El ID de sala debe ser positivo')
    .integer('El ID de sala debe ser un número entero')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  nombreSala: Yup.string().trim().max(45).nullable(),

  fechaDesde: Yup.date().nullable(),

  fechaHasta: Yup.date().nullable(),

  page: Yup.number()
    .positive('La página debe ser positiva')
    .integer('La página debe ser un número entero')
    .default(1)
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return 1;
      }
      return value;
    }),

  limit: Yup.number()
    .positive('El límite debe ser positivo')
    .integer('El límite debe ser un número entero')
    .max(100, 'El límite máximo es 100')
    .default(10)
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return 10;
      }
      return value;
    }),
});

export const reservasFilterSchema = Yup.object().shape({
  estado: Yup.string().oneOf(Object.values(ESTADOS_RESERVA), 'Estado inválido').nullable(),

  limit: Yup.number()
    .positive()
    .integer()
    .max(100)
    .default(5)
    .transform((value, originalValue) => (originalValue === '' ? 5 : value)),
});

export const idParamSchema = Yup.object().shape({
  id: Yup.number()
    .required('El ID es requerido')
    .positive('El ID debe ser positivo')
    .integer('El ID debe ser un número entero'),
});

export const dniParamSchema = Yup.object().shape({
  dni: Yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos')
    .trim(),
});

export const salaParamSchema = Yup.object().shape({
  param: Yup.mixed().test('id-or-name', 'Parámetro inválido', function (value) {
    if (!value) return false;
    // Puede ser un número (ID) o un string (nombre)
    if (/^\d+$/.test(value)) {
      return !isNaN(parseInt(value, 10));
    }
    return typeof value === 'string' && value.length > 0 && value.length <= 45;
  }),
});
