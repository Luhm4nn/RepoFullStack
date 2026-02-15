import * as Yup from 'yup';

/**
 * Esquema de validación para el inicio de sesión.
 * Requiere email (formato válido) y contraseña (mínimo 6 caracteres).
 */
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
