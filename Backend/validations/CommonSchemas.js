import * as Yup from 'yup';

export const searchQuerySchema = Yup.object().shape({
  q: Yup.string()
    .trim()
    .max(100, 'El término de búsqueda es demasiado largo')
    .nullable(),
  
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

export const funcionesFilterSchema = Yup.object().shape({
  estado: Yup.string()
    .oneOf(['activas', 'inactivas', 'publicas'], 'Estado inválido')
    .nullable(),
  
  idPelicula: Yup.number()
    .positive()
    .integer()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  
  nombrePelicula: Yup.string()
    .trim()
    .max(100)
    .nullable(),
  
  idSala: Yup.number()
    .positive()
    .integer()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  
  nombreSala: Yup.string()
    .trim()
    .max(45)
    .nullable(),
  
  fechaDesde: Yup.date().nullable(),
  
  fechaHasta: Yup.date().nullable(),
  
  limit: Yup.number()
    .positive()
    .integer()
    .max(100)
    .default(10)
    .transform((value, originalValue) => originalValue === '' ? 10 : value),
});

export const reservasFilterSchema = Yup.object().shape({
  estado: Yup.string()
    .oneOf(['CONFIRMADA', 'CANCELADA'], 'Estado inválido')
    .nullable(),
  
  limit: Yup.number()
    .positive()
    .integer()
    .max(100)
    .default(5)
    .transform((value, originalValue) => originalValue === '' ? 5 : value),
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
  param: Yup.mixed()
    .test('id-or-name', 'Parámetro inválido', function(value) {
      if (!value) return false;
      // Puede ser un número (ID) o un string (nombre)
      if (/^\d+$/.test(value)) {
        return !isNaN(parseInt(value, 10));
      }
      return typeof value === 'string' && value.length > 0 && value.length <= 45;
    }),
});
