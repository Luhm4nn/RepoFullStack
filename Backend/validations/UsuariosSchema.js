import * as Yup from 'yup';

export const usuarioCreateSchema = Yup.object().shape({
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
    .trim()
    .lowercase(),
  
  contrasena: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  telefono: Yup.string()
    .matches(/^\d{8,15}$/, 'El teléfono debe tener entre 8 y 15 dígitos')
    .nullable()
    .transform((value) => value || null)
    .trim(),
});

export const usuarioUpdateSchema = Yup.object().shape({
  nombreUsuario: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .trim(),
  
  apellidoUsuario: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo')
    .trim(),
  
  email: Yup.string()
    .email('El email no es válido')
    .trim()
    .lowercase(),
  
  telefono: Yup.string()
    .matches(/^\d{8,15}$/, 'El teléfono debe tener entre 8 y 15 dígitos')
    .nullable()
    .transform((value) => value || null)
    .trim(),
});