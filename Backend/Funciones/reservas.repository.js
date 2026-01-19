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
 * Crea una reserva y bloquea los asientos de forma atómica (Transacción)
 * @param {Object} reservaData - Datos de la reserva
 * @param {Array} asientos - Lista de asientos a bloquear
 */
async function createWithSeats(reservaData, asientos) {
  return await prisma.$transaction(async (tx) => {
    const idSala = parseInt(reservaData.idSala, 10);
    const DNI = parseInt(reservaData.DNI, 10);
    const total = parseFloat(reservaData.total);
    const subFunc = new Date(reservaData.fechaHoraFuncion);
    const subRes = removeMilliseconds(reservaData.fechaHoraReserva || new Date());

    // 1. Limpieza de cualquier reserva pendiente previa del usuario (Single active policy)
    await tx.reserva.deleteMany({
      where: {
        DNI: DNI,
        estado: 'PENDIENTE',
      },
    });

    // 2. Verificar disponibilidad de asientos (Double-check concurrente)
    for (const asiento of asientos) {
      const busy = await tx.asiento_reserva.findUnique({
        where: {
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
            idSala,
            filaAsiento: asiento.filaAsiento,
            nroAsiento: parseInt(asiento.nroAsiento, 10),
            fechaHoraFuncion: subFunc
          }
        }
      });
      if (busy) {
        throw new Error(`El asiento ${asiento.filaAsiento}${asiento.nroAsiento} ya no está disponible.`);
      }
    }

    // 3. Crear la Reserva
    const newReserva = await tx.reserva.create({
      data: {
        idSala,
        fechaHoraFuncion: subFunc,
        DNI,
        estado: 'PENDIENTE',
        fechaHoraReserva: subRes,
        total,
      },
    });

    // 4. Crear los registros de Asientos Reservados
    const asientosToCreate = asientos.map(a => ({
      idSala,
      filaAsiento: a.filaAsiento,
      nroAsiento: parseInt(a.nroAsiento, 10),
      fechaHoraFuncion: subFunc,
      DNI,
      fechaHoraReserva: subRes
    }));

    await tx.asiento_reserva.createMany({
      data: asientosToCreate
    });

    return newReserva;
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

export { getOne, getAll, createWithSeats, deleteOne, cancel, getLatest, confirm, deletePendingByUser };
