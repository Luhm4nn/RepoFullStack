import * as Yup from 'yup';

/**
 * Esquema de validación para la creación de una reserva básica.
 */
export const reservaCreateSchema = Yup.object().shape({
  idSala: Yup.number()
    .required('El ID de sala es requerido')
    .positive('El ID de sala debe ser positivo')
    .integer('El ID de sala debe ser un número entero'),
  
  fechaHoraFuncion: Yup.date()
    .required('La fecha y hora de la función es requerida')
    .test('fecha-futura', 'La función debe ser futura', function(value) {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  
  DNI: Yup.number()
    .required('El DNI es requerido')
    .positive('El DNI debe ser positivo')
    .integer('El DNI debe ser un número entero')
    .test('dni-length', 'El DNI debe tener 7 u 8 dígitos', function(value) {
      if (!value) return false;
      const dniStr = value.toString();
      return dniStr.length === 7 || dniStr.length === 8;
    }),
  
  total: Yup.number()
    .required('El total es requerido')
    .positive('El total debe ser mayor a 0')
    .test('decimal-places', 'El total debe tener máximo 2 decimales', function(value) {
      if (!value) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  
  fechaHoraReserva: Yup.date()
    .required('La fecha y hora de reserva es requerida'),
});

export const asientosReservadosSchema = Yup.array().of(
  Yup.object().shape({
    idSala: Yup.number().required().positive().integer(),
    filaAsiento: Yup.string().required().length(1).uppercase().trim(),
    nroAsiento: Yup.number().required().positive().integer(),
    fechaHoraFuncion: Yup.date().required(),
    DNI: Yup.number().required().positive().integer(),
    fechaHoraReserva: Yup.date().required(),
  })
).min(1, 'Debe seleccionar al menos un asiento');

export const atomicReservaCreateSchema = Yup.object().shape({
  reserva: Yup.object().shape({
    idSala: Yup.number().required().positive().integer(),
    fechaHoraFuncion: Yup.date().required(),
    DNI: Yup.number().required().positive().integer(),
    total: Yup.number().required().positive(),
    fechaHoraReserva: Yup.date().required(),
  }).required(),
  asientos: Yup.array().of(
    Yup.object().shape({
      filaAsiento: Yup.string().required().length(1).uppercase(),
      nroAsiento: Yup.number().required().positive().integer(),
    })
  ).min(1, 'Debe seleccionar al menos un asiento').required(),
});
