import * as Yup from 'yup';

const parametrosSchema = Yup.object().shape({
  descripcionParametro: Yup.string()
    .required('La descripción es requerida')
    .min(1, 'La descripción debe tener al menos 1 caracter')
    .max(45, 'La descripción no puede exceder 45 caracteres'),
  valor: Yup.number()
    .required('El valor es requerido')
    .min(1, 'El valor debe ser mayor a 0')
    .max(9999, 'El valor no puede ser mayor a 9999'),
});

export default parametrosSchema;
export { parametrosSchema };
