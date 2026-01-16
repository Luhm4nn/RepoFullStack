import * as repository from './reservas.repository.js';
import logger from '../utils/logger.js';

/**
 * Valida que el usuario tenga permiso para acceder al recurso
 * @param {Object} user - Usuario autenticado (req.user)
 * @param {number} targetDNI - DNI del recurso
 * @throws {Error} Si no tiene permiso
 */
function validateOwnership(user, targetDNI) {
  logger.debug('=== VALIDATE OWNERSHIP ===');
  logger.debug('User:', user);
  logger.debug('Target DNI:', targetDNI);
  logger.debug('User rol:', user?.rol);
  logger.debug('User id:', user?.id);
  logger.debug('Parsed target DNI:', parseInt(targetDNI));

  if (user.rol === 'ADMIN') {
    logger.debug('Usuario es ADMIN, acceso permitido');
    return;
  }

  if (user.id !== parseInt(targetDNI)) {
    logger.error('Acceso denegado: user.id !== targetDNI', {
      userId: user.id,
      targetDNI: parseInt(targetDNI)
    });
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }

  logger.debug('Validación exitosa: usuario es dueño del recurso');
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
  //Validaciones antes de confirmar la reserva
  try {
    validateOwnership(user, DNI);
    logger.debug('Validación de ownership exitosa');

    // 1. Obtener asientos reservados para este usuario, función y sala
    const asientosService = await import('./asientoreservas.service.js');
    const asientosReservados = await asientosService.getByFuncion(idSala, fechaHoraFuncion);
    const asientosUsuario = asientosReservados.filter(a => a.DNI === DNI);

    if (asientosUsuario.length === 0) {
      logger.error('No hay asientos reservados para este usuario en esta función');
      const error = new Error('No hay asientos reservados para este usuario en esta función');
      error.status = 400;
      throw error;
    }

    // 2. Calcular el total sumando la tarifa de cada asiento
    const tarifaRepo = await import('../Tarifas/tarifas.repository.js');
    let totalCalculado = 0;
    for (const asiento of asientosUsuario) {
      if (!asiento.idTarifa) {
        logger.error(`El asiento ${asiento.filaAsiento}${asiento.nroAsiento} no tiene tarifa asignada`);
        const error = new Error(`El asiento ${asiento.filaAsiento}${asiento.nroAsiento} no tiene tarifa asignada`);
        error.status = 400;
        throw error;
      }
      const tarifa = await tarifaRepo.getOne(asiento.idTarifa);
      if (!tarifa) {
        logger.error(`Tarifa no encontrada para asiento ${asiento.filaAsiento}${asiento.nroAsiento}`);
        const error = new Error(`Tarifa no encontrada para asiento ${asiento.filaAsiento}${asiento.nroAsiento}`);
        error.status = 400;
        throw error;
      }
      totalCalculado += parseFloat(tarifa.precio);
    }

    // 3. Validar el total recibido
    if (parseFloat(total) !== totalCalculado) {
      logger.error('El total recibido no coincide con el calculado');
      const error = new Error('El total recibido no coincide con el calculado');
      error.status = 400;
      throw error;
    }

    // 4. Crear la reserva principal con el total calculado
    const result = await repository.create({ ...data, total: totalCalculado });
    logger.info('Reserva creada exitosamente:', result);
    return result;
  } catch (error) {
    logger.error('Error en createReserva service:', error.message);
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
  
  let userReservas = allReservas.filter(r => r.DNI === parseInt(userDNI));
  
  if (estado && (estado === 'CONFIRMADA' || estado === 'CANCELADA')) {
    userReservas = userReservas.filter(r => r.estadoReserva === estado);
  }
  
  userReservas.sort((a, b) => 
    new Date(b.fechaHoraReserva) - new Date(a.fechaHoraReserva)
  );
  
  return userReservas;
}
