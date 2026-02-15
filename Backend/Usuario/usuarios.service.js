import * as repository from './usuarios.repository.js';
import bcrypt from 'bcryptjs';

/**
 * Valida si el usuario autenticado tiene permisos para acceder o modificar los datos de un DNI objetivo.
 * Los administradores tienen acceso total. Los clientes solo a su propio perfil.
 * 
 * @param {Object} user - Objeto del usuario extraído del token (req.user).
 * @param {number|string} targetDNI - DNI del recurso al que se intenta acceder.
 * @throws {Error} Lanza un error con status 403 si el acceso es denegado.
 */
function validateOwnership(user, targetDNI) {
  if (user.rol === 'ADMIN') {
    return;
  }

  if (user.id !== parseInt(targetDNI)) {
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }
}

/**
 * Recupera la lista completa de usuarios.
 * 
 * @returns {Promise<Array<Object>>} Promesa que resuelve en un array de usuarios.
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene los detalles de un usuario específico validando la propiedad de la cuenta.
 * 
 * @param {number|string} dni - DNI del usuario solicitado.
 * @param {Object} user - Usuario autenticado que realiza la petición.
 * @returns {Promise<Object|null>} Promesa que resuelve en el objeto del usuario.
 */
export const getOne = async (dni, user) => {
  validateOwnership(user, dni);
  return await repository.getOne(dni);
};

/**
 * Procesa la creación de un nuevo usuario, incluyendo el hasheo de la contraseña.
 * 
 * @param {Object} data - Datos del nuevo usuario.
 * @returns {Promise<Object>} El usuario creado sin datos sensibles.
 */
export const create = async (data) => {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);
  const usuarioData = { ...data, contrasena: hashedPassword };
  return await repository.create(usuarioData);
};

/**
 * Elimina un usuario del sistema.
 * 
 * @param {number|string} id - DNI del usuario a eliminar.
 * @returns {Promise<Object>} Confirmación de la eliminación.
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};

/**
 * Actualiza la información de un usuario, validando permisos y existencia.
 * 
 * @param {number|string} dni - DNI del usuario a actualizar.
 * @param {Object} data - Nuevos datos.
 * @param {Object} user - Usuario autenticado que realiza la actualización.
 * @returns {Promise<Object>} El usuario actualizado.
 * @throws {Error} 404 si el usuario no existe.
 */
export const update = async (dni, data, user) => {
  validateOwnership(user, dni);

  const usuarioExistente = await repository.getOne(dni);
  if (!usuarioExistente) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  // Sanitización: Evitamos que se actualice el DNI o el ROL si no es ADMIN
  const updateData = {
    nombreUsuario: data.nombreUsuario,
    apellidoUsuario: data.apellidoUsuario,
    email: data.email,
    telefono: data.telefono,
  };

  if (user.rol === 'ADMIN' && data.rol) {
    updateData.rol = data.rol;
  }

  // Nota: No actualizamos el password aquí para mayor seguridad (ver changePassword)
  return await repository.update(dni, updateData);
};

/**
 * Cambia la contraseña de un usuario validando la actual.
 * 
 * @param {number|string} dni - DNI del usuario.
 * @param {string} currentPassword - Contraseña actual.
 * @param {string} newPassword - Nueva contraseña.
 * @throws {Error} 400 si la contraseña actual es incorrecta.
 */
export const changePassword = async (dni, currentPassword, newPassword) => {
  const usuario = await repository.getOne(dni);
  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, usuario.contrasena);
  if (!isMatch) {
    const error = new Error('La contraseña actual es incorrecta.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await repository.update(dni, { contrasena: hashedPassword });
};
