import * as Yup from 'yup';

// Schema para validar login
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('El email es requerido')
    .email('El email no es válido')
    .trim()
    .lowercase(),
  
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
