import prisma from '../prisma/prisma.js';
import logger from '../utils/logger.js';

/**
 * Obtiene todas las reservas
 * @returns {Promise<Array>} Lista de reservas
 */
async function getAll() {
  return await prisma.reserva.findMany({
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
        },
      },
    },
  });
}

/**
 * Obtiene una reserva específica
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object|null>} Reserva encontrada o null
 */
async function getOne({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  return await prisma.reserva.findUnique({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
        DNI: parseInt(DNI, 10),
        fechaHoraReserva: removeMilliseconds(fechaHoraReserva),
      },
    },
  });
}

const removeMilliseconds = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setMilliseconds(0);
  return newDate;
};

/**
 * Crea una nueva reserva
 * @param {Object} data - Datos de la reserva
 * @returns {Promise<Object>} Reserva creada
 */
async function create(data) {
  if (!data.idSala || !data.fechaHoraFuncion || !data.DNI || data.total === undefined || data.total === null) {
    const error = new Error('Faltan datos requeridos para crear la reserva');
    error.status = 400;
    throw error;
  }

  const idSala = parseInt(data.idSala, 10);
  const DNI = parseInt(data.DNI, 10);
  const total = parseFloat(data.total);

  if (isNaN(idSala) || isNaN(DNI) || isNaN(total)) {
    const error = new Error('Datos numéricos inválidos');
    error.status = 400;
    throw error;
  }

  // Procesar fechas
  const fechaFuncionDate = new Date(data.fechaHoraFuncion);
  const fechaReservaDate = data.fechaHoraReserva
    ? removeMilliseconds(data.fechaHoraReserva)
    : removeMilliseconds(new Date());

  if (!fechaFuncionDate || !fechaReservaDate) {
    const error = new Error('Fechas inválidas');
    error.status = 400;
    throw error;
  }

  return await prisma.reserva.create({
    data: {
      idSala,
      fechaHoraFuncion: fechaFuncionDate,
      DNI,
      estado: 'PENDIENTE',
      fechaHoraReserva: fechaReservaDate,
      total,
    },
  });
}

/**
 * Elimina una reserva
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva eliminada
 */
async function deleteOne({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  const where = {
    idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: new Date(fechaHoraFuncion),
      DNI: parseInt(DNI, 10),
      fechaHoraReserva: removeMilliseconds(fechaHoraReserva),
    },
  };

  try {
    return await prisma.reserva.delete({ where });
  } catch (error) {
    logger.error('Error eliminando reserva:', error.message);
    throw error;
  }
}

/**
 * Cancela una reserva (Transacción)
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva cancelada
 */
async function cancel({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  const where = {
    idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: new Date(fechaHoraFuncion),
      DNI: parseInt(DNI, 10),
      fechaHoraReserva: removeMilliseconds(fechaHoraReserva),
    },
  };

  return await prisma.$transaction(async (tx) => {
    const cancelledReserva = await tx.reserva.update({
      where,
      data: {
        estado: 'CANCELADA',
        fechaHoraCancelacion: new Date(),
      },
    });

    await tx.asiento_reserva.deleteMany({
      where: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
        DNI: parseInt(DNI, 10),
        fechaHoraReserva: removeMilliseconds(fechaHoraReserva),
      },
    });

    return cancelledReserva;
  });
}

/**
 * Obtiene las últimas reservas activas
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} Lista de reservas
 */
async function getLatest(limit = 5) {
  return await prisma.reserva.findMany({
    where: {
      estado: 'ACTIVA'
    },
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
        },
      },
    },
    orderBy: {
      fechaHoraReserva: 'desc'
    },
    take: limit
  });
}

async function confirm({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  return await prisma.reserva.update({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
        DNI: parseInt(DNI, 10),
        fechaHoraReserva: new Date(fechaHoraReserva),
      },
    },
    data: {
      estado: 'CONFIRMADA',
    },
  });
}

/**
 * Elimina todas las reservas PENDIENTES de un usuario
 * @param {number} DNI - DNI del usuario
 */
async function deletePendingByUser(DNI) {
  return await prisma.reserva.deleteMany({
    where: {
      DNI: parseInt(DNI, 10),
      estado: 'PENDIENTE',
    },
  });
}

export { getOne, getAll, create, deleteOne, cancel, getLatest, confirm, deletePendingByUser };
