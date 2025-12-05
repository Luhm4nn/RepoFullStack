import * as repository from './asientos.repository.js';

/**
 * Obtiene todos los asientos de una sala
 * @param {number} idSala - ID de la sala
 * @returns {Promise<Array>} Lista de asientos
 */
export const getAll = async (idSala) => {
  return await repository.getAll(idSala);
};

/**
 * Obtiene un asiento específico
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Asiento encontrado
 */
export const getOne = async (params) => {
  return await repository.getOne(params);
};

/**
 * Crea un asiento individual
 * @param {number} idSala - ID de la sala
 * @param {Object} data - Datos del asiento
 * @returns {Promise<Object>} Asiento creado
 */
export const create = async (idSala, data) => {
  return await repository.create(idSala, data);
};

/**
 * Elimina un asiento
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Asiento eliminado
 */
export const deleteOne = async (params) => {
  return await repository.deleteOne(params);
};

/**
 * Actualiza un asiento
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Asiento actualizado
 * @throws {Error} Si el asiento no existe (404)
 */
export const update = async (params, data) => {
  const asientoExistente = await repository.getOne(params);
  if (!asientoExistente) {
    const error = new Error('Asiento no encontrado.');
    error.status = 404;
    throw error;
  }
  return await repository.update(params, data);
};
