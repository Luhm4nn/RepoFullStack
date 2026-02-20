import * as repository from './salas.repository.js';
import { getFuncionesBySalaId } from '../Funciones/funciones.service.js';

/**
 * Recupera todas las salas de cine configuradas.
 * @returns {Promise<Array>} Listado de salas.
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene una sala por su identificador único o nombre.
 * @param {string|number} param - ID numérico o nombre de la sala.
 * @returns {Promise<Object>} Datos de la sala.
 * @throws {Error} Si no se encuentra la sala.
 */
export const getOne = async (param) => {
  const sala = await repository.getOne(param);
  return sala;
};

/**
 * Crea una nueva sala en el sistema.
 * @param {Object} data - Objeto con nombre, ubicación y dimensiones.
 * @returns {Promise<Object>} Registro de sala creado.
 */
export const create = async (data) => {
  return await repository.create(data);
};

/**
 * Elimina una sala por su ID.
 * @param {number} id - ID de la sala.
 * @returns {Promise<Object>} Registro eliminado.
 */
export const deleteOne = async (id) => {
  const salaExistente = await repository.getOne(id);
  if (!salaExistente) {
    const error = new Error('Sala no encontrada.');
    error.status = 404;
    throw error;
  }

  // No permitir eliminar salas que tengan funciones
  const funciones = await getFuncionesBySalaId(id);
  if (funciones.length > 0) {
    const error = new Error(
      `No se puede eliminar la sala porque tiene ${funciones.length} funciones asociadas.`
    );
    error.status = 400;
    throw error;
  }

  return await repository.deleteOne(id);
};

/**
 * Actualiza la información de ubicación o nombre de una sala.
 * @param {number} id - ID de la sala.
 * @param {Object} data - Nuevos valores de ubicación o nombre.
 * @returns {Promise<Object>} Sala actualizada.
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
 * Obtiene el conteo total de salas.
 * @returns {Promise<number>} Cantidad de salas.
 */
export const getCountAll = async () => {
  return await repository.countAll();
};

/**
 * Busca salas que coincidan parcialmente con un texto de búsqueda.
 * @param {string} searchQuery - Término de búsqueda.
 * @param {number} limit - Límite de resultados opcional.
 * @returns {Promise<Array>} Salas encontradas.
 */
export const search = async (searchQuery, limit) => {
  return await repository.search(searchQuery, limit);
};
