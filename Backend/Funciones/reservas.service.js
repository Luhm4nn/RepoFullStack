import * as repository from './reservas.repository.js';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
 */
function validateOwnership(user, targetDNI) {
  console.log('=== VALIDATE OWNERSHIP ===');
  console.log('User:', user);
  console.log('Target DNI:', targetDNI);
  console.log('User rol:', user?.rol);
  console.log('User id:', user?.id);
  console.log('Parsed target DNI:', parseInt(targetDNI));

  if (user.rol === 'ADMIN') {
    console.log('Usuario es ADMIN, acceso permitido');
    return;
  }

  if (user.id !== parseInt(targetDNI)) {
    console.error('Acceso denegado: user.id !== targetDNI', {
      userId: user.id,
      targetDNI: parseInt(targetDNI)
    });
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }

  console.log('Validación exitosa: usuario es dueño del recurso');
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
  console.log('=== CREATE RESERVA SERVICE ===');
  console.log('Data recibida:', JSON.stringify(data, null, 2));
  console.log('User recibido:', JSON.stringify(user, null, 2));

  const { DNI } = data;
  console.log('DNI de la reserva:', DNI);
  console.log('User ID:', user?.id);
  console.log('User rol:', user?.rol);

  try {
    validateOwnership(user, DNI);
    console.log('Validación de ownership exitosa');

    const result = await repository.create(data);
    console.log('Reserva creada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error en createReserva service:', error.message);
    throw error;
  }
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

/**
 * Obtiene las reservas de un usuario específico
 * @param {number} userDNI - DNI del usuario
 * @param {string} estado - Estado opcional para filtrar (CONFIRMADA, CANCELADA)
 * @returns {Promise<Array>} Lista de reservas del usuario
 */
export async function getUserReservas(userDNI, estado = null) {
  const allReservas = await repository.getAll();
  
  // Filtrar solo las reservas del usuario
  let userReservas = allReservas.filter(r => r.DNI === parseInt(userDNI));
  
  // Filtrar por estado si se proporciona
  if (estado && (estado === 'CONFIRMADA' || estado === 'CANCELADA')) {
    userReservas = userReservas.filter(r => r.estadoReserva === estado);
  }
  
  // Ordenar por fecha más reciente primero
  userReservas.sort((a, b) => 
    new Date(b.fechaHoraReserva) - new Date(a.fechaHoraReserva)
  );
  
  return userReservas;
}
