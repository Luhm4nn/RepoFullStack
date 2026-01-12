import * as Yup from 'yup';

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
    idSala: Yup.number()
      .required('El ID de sala es requerido')
      .positive()
      .integer(),
    
    filaAsiento: Yup.string()
      .required('La fila del asiento es requerida')
      .length(1, 'La fila debe ser una sola letra')
      .matches(/^[A-Z]$/, 'La fila debe ser una letra mayúscula')
      .uppercase()
      .trim(),
    
    nroAsiento: Yup.number()
      .required('El número de asiento es requerido')
      .positive()
      .integer(),
    
    fechaHoraFuncion: Yup.date()
      .required('La fecha y hora de la función es requerida'),
    
    DNI: Yup.number()
      .required('El DNI es requerido')
      .positive()
      .integer(),
    
    fechaHoraReserva: Yup.date()
      .required('La fecha y hora de reserva es requerida'),
  })
).min(1, 'Debe seleccionar al menos un asiento');
