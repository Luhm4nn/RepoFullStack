import * as repository from './tarifas.repository.js';

/**
 * Obtiene todas las tarifas
 * @returns {Promise<Array>} Lista de tarifas
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene una tarifa por su ID
 * @param {number} id - ID de la tarifa
 * @returns {Promise<Object>} Tarifa encontrada
 * @throws {Error} Si la tarifa no existe (404)
 */
export const getOne = async (id) => {
  const tarifa = await repository.getOne(id);
  if (!tarifa) {
    const error = new Error('Tarifa no encontrada.');
    error.status = 404;
    throw error;
  }
  return tarifa;
};

/**
 * Crea una nueva tarifa
 * @param {Object} data - Datos de la tarifa
 * @returns {Promise<Object>} Tarifa creada
 */
export const create = async (data) => {
  return await repository.create(data);
};

/**
 * Actualiza una tarifa existente
 * @param {number} id - ID de la tarifa
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Tarifa actualizada
 * @throws {Error} Si la tarifa no existe (404)
 */
export const update = async (id, data) => {
  const tarifaExistente = await repository.getOne(id);
  if (!tarifaExistente) {
    const error = new Error('Tarifa no encontrada.');
    error.status = 404;
    throw error;
  } else if (
    data.precio === tarifaExistente.precio &&
    data.descripcionTarifa === tarifaExistente.descripcionTarifa
  ) {
    return null;
  }
  const hoy = new Date();
  data.fechaDesde = hoy;
  return await repository.update(id, data);
};

/**
 * Elimina una tarifa
 * @param {number} id - ID de la tarifa
 * @returns {Promise<Object>} Tarifa eliminada
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};
