import * as repository from './asientoreservas.repository.js';

/**
 * Obtiene todos los asientos reservados
 * @returns {Promise<Array>} Lista de asientos reservados
 */
export const getAll = async () => {
  const asientoreservas = await repository.getAll();
  if (!asientoreservas || asientoreservas.length === 0) {
    const error = new Error('No existen asientos reservados cargados aún.');
    error.status = 404;
    throw error;
  }
  return asientoreservas;
};

/**
 * Obtiene un asiento reservado específico
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Asiento reservado encontrado
 */
export const getOne = async (params) => {
  const asientoreserva = await repository.getOne(params);
  if (!asientoreserva) {
    const error = new Error('Reserva de asiento no encontrada.');
    error.status = 404;
    throw error;
  }
  return asientoreserva;
};

/**
 * Obtiene asientos reservados por función
 * @param {number} idSala - ID de la sala
 * @param {string} fechaHoraFuncionString - Fecha de la función
 * @returns {Promise<Array>} Lista de asientos reservados
 */
export const getByFuncion = async (idSala, fechaHoraFuncionString) => {
  const decodedString = decodeURIComponent(fechaHoraFuncionString);
  const fechaFuncionDate = new Date(decodedString);
  return await repository.getByFuncion(idSala, fechaFuncionDate);
};

/**
 * Crea múltiples reservas de asientos
 * @param {Array} data - Lista de reservas a crear
 * @returns {Promise<Object>} Resultado de la creación
 */
export const createMany = async (data) => {
  return await repository.createMany(data);
};

/**
 * Elimina una reserva de asiento
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva eliminada
 */
export const deleteOne = async (params) => {
  return await repository.deleteOne(params);
};

/**
 * Actualiza una reserva de asiento
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Reserva actualizada
 */
export const update = async (params, data) => {
  return await repository.update(params, data);
};
