import * as repository from './reservas.repository.js';
import { ESTADOS_RESERVA } from '../constants/index.js';
import logger from '../utils/logger.js';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
 */
function validateOwnership(user, targetDNI) {
  if (user.rol === 'ADMIN') return;

  if (user.id !== parseInt(targetDNI)) {
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }
}

/**
 * Obtiene todas las reservas (solo ADMIN)
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
 * Crea una nueva reserva con sus asientos (Atómico)
 */
export async function createReserva(data, user) {
  try {
    const { reserva, asientos } = data;
    validateOwnership(user, reserva.DNI);
    logger.debug('Iniciando creación atómica de reserva y asientos...');
    const result = await repository.createWithSeats(reserva, asientos);
    logger.info('Reserva PENDIENTE y asientos creados (Atómico):', result.idSala, result.DNI);
    return result;
  } catch (error) {
    logger.error('Error en createReserva service:', error.message);
    throw error;
  }
}

/**
 * Cancela una reserva
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
 */
export async function deleteReserva(params) {
  return await repository.deleteOne(params);
}

/**
 * Elimina una reserva PENDIENTE (usado por el usuario al cancelar/timeout)
 */
export async function deletePendingReserva(params, user) {
  const { DNI } = params;
  validateOwnership(user, DNI);

  const reserva = await repository.getOne(params);
  if (!reserva) {
    const error = new Error('Reserva no encontrada.');
    error.status = 404;
    throw error;
  }

  if (reserva.estado !== ESTADOS_RESERVA.PENDIENTE) {
    const error = new Error('Solo se pueden eliminar reservas en estado PENDIENTE por esta vía');
    error.status = 400;
    throw error;
  }
  return await repository.deleteOne(params);
}

/**
 * Obtiene las últimas reservas
 */
export async function getLatestReservas(limit) {
  return await repository.getLatest(limit);
}

/**
 * Obtiene las reservas de un usuario específico
 */
export async function getUserReservas(userDNI, estado) {
  validateOwnership({ id: userDNI, rol: 'USER' }, userDNI);
  let userReservas = await repository.getByUserAndStatus(userDNI, estado);
  return userReservas;
}

/**
 * Confirma una reserva (pasa de PENDIENTE a ACTIVA)
 */
export async function confirmReserva(params, user) {
  const { DNI } = params;
  validateOwnership(user, DNI);

  const reserva = await repository.getOne(params);
  if (!reserva) {
    const error = new Error('Reserva no encontrada.');
    error.status = 404;
    throw error;
  }

  if (reserva.estado !== ESTADOS_RESERVA.PENDIENTE) {
    const error = new Error(`No se puede confirmar una reserva en estado ${reserva.estado}`);
    error.status = 400;
    throw error;
  }
  return await repository.confirm(params);
}
