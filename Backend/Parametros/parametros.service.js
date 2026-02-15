import * as repository from './parametros.repository.js';

/**
 * Recupera todos los parámetros registrados.
 * @returns {Promise<Array>} Listado de parámetros.
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene un parámetro individual por su identificador.
 * @param {number|string} id - ID del parámetro.
 * @returns {Promise<Object>} Datos del parámetro.
 * @throws {Error} 404 si no se encuentra.
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
 * Crea un parámetro de configuración.
 * @param {Object} data - Objeto con descripción y valor.
 * @returns {Promise<Object>} Registro creado.
 */
export const create = async (data) => {
  return await repository.create(data);
};

/**
 * Elimina un parámetro.
 * @param {number|string} id - ID del parámetro.
 */
export const deleteOne = async (id) => {
  return await repository.deleteOne(id);
};

/**
 * Gestiona la actualización de un parámetro, validando su existencia previa.
 * @param {number|string} id - ID a actualizar.
 * @param {Object} data - Nuevos datos.
 * @returns {Promise<Object>} Registro modificado.
 * @throws {Error} 404 si no existe.
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
 * Lógica específica para recuperar el tiempo límite de reserva (constante ID 2).
 * @returns {Promise<number>} Valor numérico del tiempo límite.
 */
export const getTiempoLimiteReserva = async () => {
  const parametro = await repository.getOne(2);
  if (!parametro) {
    const error = new Error('Parámetro de tiempo límite de reserva no configurado (ID 2).');
    error.status = 404;
    throw error;
  }
  return parseInt(parametro.valor, 10);
};