import {
  getOne as getOneDB,
  getAll as getAllDB,
  createOne as createOneDB,
  deleteOne as deleteOneDB,
  cancellOne as cancellOneDB,
} from './reservas.repository.js';

// Service layer para Reservas
// Contiene toda la lógica de negocio y validaciones

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
 */
function validateOwnership(user, targetDNI) {
  if (user.rol === 'ADMIN') {
    return; // Admin puede acceder a todo
  }

  if (user.id !== parseInt(targetDNI)) {
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }
}

/**
 * Obtiene todas las reservas (solo ADMIN)
 * El authMiddleware ya verificó que sea ADMIN
 */
export async function getAllReservas() {
  const reservas = await getAllDB();

  if (!reservas || reservas.length === 0) {
    const error = new Error('No existen reservas cargadas aún.');
    error.status = 404;
    throw error;
  }

  return reservas;
}

/**
 * Obtiene una reserva específica
 * Valida que el usuario solo pueda ver sus propias reservas (o admin cualquiera)
 */
export async function getReserva(params, user) {
  const { DNI } = params;
  validateOwnership(user, DNI);
  const reserva = await getOneDB(params);
  if (!reserva) {
    const error = new Error('Reserva no encontrada.');
    error.status = 404;
    throw error;
  }

  return reserva;
}

/**
 * Crea una nueva reserva
 * Valida que el usuario solo pueda crear reservas para sí mismo (o admin para otros)
 */
export async function createReserva(data, user) {
  const { DNI } = data;
  validateOwnership(user, DNI);
  const newReserva = await createOneDB(data);
  return newReserva;
}

/**
 * Cancela una reserva
 * Valida ownership y reglas de cancelación
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

  const cancelledReserva = await cancellOneDB(params);
  return cancelledReserva;
}

/**
 * Elimina permanentemente una reserva (solo ADMIN)
 * El authMiddleware ya verificó que sea ADMIN
 */
export async function deleteReserva(params) {
  const deletedReserva = await deleteOneDB(params);
  return deletedReserva;
}
