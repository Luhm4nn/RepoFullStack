import * as repository from './asientos.repository.js';

/**
 * Obtiene todos los asientos de una sala, incluyendo su tarifa y relación con la sala.
 * @param {number} idSala - Identificador de la sala.
 * @returns {Promise<Array>} Listado de asientos.
 */
export const getAll = async (idSala) => {
  return await repository.getAll(idSala);
};

/**
 * Recupera un asiento específico basado en su sala, fila y número.
 * @param {Object} params - Identificadores combinados (idSala, filaAsiento, nroAsiento).
 * @returns {Promise<Object>} Asiento encontrado.
 */
export const getOne = async (params) => {
  return await repository.getOne(params);
};

/**
 * Crea un asiento de forma manual para una sala.
 * @param {number} idSala - ID de la sala.
 * @param {Object} data - Datos del asiento (fila, número, tipo).
 * @returns {Promise<Object>} Asiento creado.
 */
export const create = async (idSala, data) => {
  return await repository.create(idSala, data);
};

/**
 * Elimina un asiento específico mediante sus identificadores únicos.
 * @param {Object} params - Identificadores combinados.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteOne = async (params) => {
  return await repository.deleteOne(params);
};

/**
 * Actualiza los datos de un asiento (ej. cambiar categoría a VIP).
 * @param {Object} params - Identificadores únicos.
 * @param {Object} data - Datos nuevos.
 * @returns {Promise<Object>} Asiento actualizado.
 * @throws {Error} Si el asiento no existe.
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
