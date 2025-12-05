import * as repository from './salas.repository.js';

/**
 * Obtiene todas las salas
 * @returns {Promise<Array>} Lista de salas
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene una sala por ID o Nombre
 * @param {string|number} param - ID o Nombre de la sala
 * @returns {Promise<Object>} Sala encontrada
 * @throws {Error} Si la sala no existe (404)
 */
export const getOne = async (param) => {
  const sala = await repository.getOne(param);
  return sala;
};

/**
 * Crea una nueva sala
 * @param {Object} data - Datos de la sala
 * @returns {Promise<Object>} Sala creada
 */
export const create = async (data) => {
  return await repository.create(data);
};

/**
 * Elimina una sala
 * @param {number} id - ID de la sala
 * @returns {Promise<Object>} Sala eliminada
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};

/**
 * Actualiza una sala existente
 * @param {number} id - ID de la sala
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Sala actualizada
 * @throws {Error} Si la sala no existe (404)
 */
export const update = async (id, data) => {
  const salaExistente = await repository.getOne(id);
  if (!salaExistente) {
    const error = new Error('Sala no encontrada.');
    error.status = 404;
    throw error;
  }
  return await repository.update(id, data);
};

/**
 * Cuenta todas las salas
 * @returns {Promise<number>} Cantidad de salas
 */
export const getCountAll = async () => {
  return await repository.countAll();
};
