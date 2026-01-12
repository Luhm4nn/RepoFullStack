import * as Yup from 'yup';

// Schema para validar reserva antes de enviar
export const reservaSchema = Yup.object().shape({
  DNI: Yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{7,8}$/, 'Ingresa un DNI válido de 7 u 8 dígitos')
    .trim(),
  
  selectedSeats: Yup.array()
    .min(1, 'Debes seleccionar al menos un asiento')
    .required('Debes seleccionar asientos'),
  
  total: Yup.number()
    .required('El total es requerido')
    .positive('El total debe ser mayor a 0'),
});
