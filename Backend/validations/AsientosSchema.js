import * as Yup from 'yup';

export const asientoCreateSchema = Yup.object().shape({
  filaAsiento: Yup.string()
    .required('La fila del asiento es requerida')
    .length(1, 'La fila debe ser una sola letra')
    .matches(/^[A-Z]$/, 'La fila debe ser una letra mayúscula')
    .uppercase()
    .trim(),
  
  nroAsiento: Yup.number()
    .required('El número de asiento es requerido')
    .positive('El número de asiento debe ser positivo')
    .integer('El número de asiento debe ser un número entero')
    .min(1, 'El número de asiento debe ser al menos 1')
    .max(25, 'El número de asiento no puede exceder 25'),
  
  tipoAsiento: Yup.string()
    .required('El tipo de asiento es requerido')
    .oneOf(['VIP', 'STANDARD'], 'El tipo de asiento debe ser VIP o STANDARD')
    .uppercase()
    .trim(),
});

export const asientoUpdateSchema = Yup.object().shape({
  tipoAsiento: Yup.string()
    .oneOf(['VIP', 'STANDARD'], 'El tipo de asiento debe ser VIP o STANDARD')
    .uppercase()
    .trim(),
});
