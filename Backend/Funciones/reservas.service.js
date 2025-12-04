import * as repository from './reservas.repository.js';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
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
 * Obtiene todas las reservas (solo ADMIN)
 * @returns {Promise<Array>} Lista de reservas
 */
export async function getAllReservas() {
  const reservas = await repository.getAll();

  if (!reservas || reservas.length === 0) {
    const error = new Error('No existen reservas cargadas aún.');
    error.status = 404;
    throw error;
  }

  return reservas;
}

/**
 * Obtiene una reserva específica
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Reserva encontrada
 */
export async function getReserva(params, user) {
  const { DNI } = params;
  validateOwnership(user, DNI);
  const reserva = await repository.getOne(params);
  if (!reserva) {
    const error = new Error('Reserva no encontrada.');
    error.status = 404;
    throw error;
  }

  return reserva;
}

/**
 * Crea una nueva reserva
 * @param {Object} data - Datos de la reserva
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Reserva creada
 */
export async function createReserva(data, user) {
  const { DNI } = data;
  validateOwnership(user, DNI);
  return await repository.create(data);
}

/**
 * Cancela una reserva
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} user - Usuario autenticado
 * @returns {Promise<Object>} Reserva cancelada
 */
export async function cancelReserva(params, user) {
  const { DNI, fechaHoraFuncion } = params;
  validateOwnership(user, DNI);
  
  const fechaFuncion = new Date(fechaHoraFuncion);
  const now = new Date();
  const horasHastaFuncion = (fechaFuncion - now) / (1000 * 60 * 60);

  if (horasHastaFuncion < 2) {
    const error = new Error(
      'No se puede cancelar una reserva con menos de 2 horas de anticipación'
    );
    error.status = 400;
    throw error;
  }

  return await repository.cancel(params);
}

/**
 * Elimina permanentemente una reserva (solo ADMIN)
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva eliminada
 */
export async function deleteReserva(params) {
  return await repository.deleteOne(params);
}

/**
 * Obtiene las últimas reservas
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} Lista de reservas
 */
export async function getLatestReservas(limit) {
  return await repository.getLatest(limit);
}
