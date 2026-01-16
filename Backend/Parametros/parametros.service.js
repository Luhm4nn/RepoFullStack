import * as repository from './parametros.repository.js';

/**
 * Obtiene todos los parámetros del sistema
 * @returns {Promise<Array>} Lista de parámetros
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene un parámetro por su ID
 * @param {number} id - ID del parámetro
 * @returns {Promise<Object>} Parámetro encontrado
 * @throws {Error} Si el parámetro no existe (404)
 */
export const getOne = async (id) => {
  const parametro = await repository.getOne(id);
  if (!parametro) {
    const error = new Error('Parámetro no encontrado.');
    error.status = 404;
    throw error;
  }
  return parametro;
};

/**
 * Crea un nuevo parámetro
 * @param {Object} data - Datos del parámetro
 * @param {string} data.descripcionParametro - Descripción del parámetro
 * @param {string} data.valor - Valor del parámetro
 * @returns {Promise<Object>} Parámetro creado
 */
export const create = async (data) => {
  return await repository.create(data);
};

/**
 * Elimina un parámetro por su ID
 * @param {number} id - ID del parámetro
 * @returns {Promise<Object>} Parámetro eliminado
 * @throws {Error} Si el parámetro no existe
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};

/**
 * Actualiza un parámetro existente
 * @param {number} id - ID del parámetro
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Parámetro actualizado
 * @throws {Error} Si el parámetro no existe (404)
 */
export const update = async (id, data) => {
  const parametroExistente = await repository.getOne(id);
  if (!parametroExistente) {
    const error = new Error('Parámetro no encontrado.');
    error.status = 404;
    throw error;
  }
  return await repository.update(id, data);
};

/**
 * Obtiene el tiempo límite de reserva
 * @returns {Promise<number>} Tiempo límite de reserva en minutos
 * @throws {Error} Si no se encuentra el parámetro (404)
 */
export const getTiempoLimiteReserva = async () => {
  const parametro = await repository.getOne(1);
  if (!parametro) {
    const error = new Error('Parámetro de tiempo límite de reserva no encontrado.');
    error.status = 404;
    throw error;
  }
  return parseInt(parametro.valor, 10);
};