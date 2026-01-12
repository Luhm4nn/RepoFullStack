import * as repository from './usuarios.repository.js';
import bcrypt from 'bcryptjs';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado
 * @param {number} targetDNI - DNI del recurso objetivo
 * @throws {Error} Si no tiene permiso (403)
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
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene un usuario por DNI
 * @param {number} dni - DNI del usuario
 * @param {Object} user - Usuario autenticado (para validación)
 * @returns {Promise<Object>} Usuario encontrado
 */
export const getOne = async (dni, user) => {
  validateOwnership(user, dni);
  return await repository.getOne(dni);
};

/**
 * Crea un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
export const create = async (data) => {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);
  const usuarioData = { ...data, contrasena: hashedPassword };
  return await repository.create(usuarioData);
};

/**
 * Elimina un usuario
 * @param {number} id - DNI del usuario
 * @returns {Promise<Object>} Usuario eliminado
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};

/**
 * Actualiza un usuario existente
 * @param {number} dni - DNI del usuario
 * @param {Object} data - Datos a actualizar
 * @param {Object} user - Usuario autenticado (para validación)
 * @returns {Promise<Object>} Usuario actualizado
 * @throws {Error} Si el usuario no existe (404)
 */
export const update = async (dni, data, user) => {
  validateOwnership(user, dni);

  const usuarioExistente = await repository.getOne(dni);
  if (!usuarioExistente) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  return await repository.update(dni, data);
};
