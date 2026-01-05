import * as Yup from 'yup';

// Schema para REGISTRO (incluye confirmPassword para validación frontend)
export const registerSchema = Yup.object().shape({
  DNI: Yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos')
    .trim(),
  
  nombreUsuario: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .trim(),
  
  apellidoUsuario: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo')
    .trim(),
  
  email: Yup.string()
    .required('El email es requerido')
    .email('El email no es válido')
    .trim(),
  
  contrasena: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  confirmPassword: Yup.string()
    .required('Confirma tu contraseña')
    .oneOf([Yup.ref('contrasena')], 'Las contraseñas no coinciden'),
  
  telefono: Yup.string()
    .matches(/^\d{8,15}$/, 'El teléfono debe tener entre 8 y 15 dígitos')
    .nullable()
    .transform((value) => value || null)
    .trim(),
});

// Schema para EDITAR perfil (sin contraseña ni DNI, sin confirmPassword)
export const editProfileSchema = Yup.object().shape({
  nombreUsuario: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .trim(),
  
  apellidoUsuario: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo')
    .trim(),
  
  email: Yup.string()
    .required('El email es requerido')
    .email('El email no es válido')
    .trim(),
  
  telefono: Yup.string()
    .matches(/^\d{8,15}$/, 'El teléfono debe tener entre 8 y 15 dígitos')
    .nullable()
    .transform((value) => value || null)
    .trim(),
});