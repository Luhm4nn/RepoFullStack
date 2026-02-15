import prisma from '../prisma/prisma.js';
import logger from '../utils/logger.js';
import { ESTADOS_RESERVA } from '../constants/index.js';

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
 * Obtiene reservas por ususario y estado
 * @param {number} DNI - DNI del usuario
 * @param {string} estado - Estado de la reserva
 * @returns {Promise<Array>} Lista de reservas
 */

async function getByUserAndStatus(DNI, estado) {
  const whereClause = {
    DNI: parseInt(DNI, 10),
  };
  if (estado) {
    whereClause.estado = estado.toUpperCase();
  }
  return await prisma.reserva.findMany({
    where: whereClause,
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
        },
      },
    },
    orderBy: {
      fechaHoraReserva: 'desc',
    },
  });
}

/**
 * Crea una reserva y bloquea los asientos de forma atómica (Transacción)
 * @param {Object} reservaData - Datos de la reserva
 * @param {Array} asientos - Lista de asientos a bloquear
 */
async function createWithSeats(reservaData, asientos) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();
    const idSala = parseInt(reservaData.idSala, 10);
    const DNI = parseInt(reservaData.DNI, 10);
    const subFunc = new Date(reservaData.fechaHoraFuncion);
    const subRes = removeMilliseconds(now);

    // Validaciones
    // Verificar que el usuario exista
    const usuario = await tx.usuario.findUnique({
      where: {
        DNI: DNI,
      },
    });
    if (!usuario) {
      throw new Error('El usuario especificado no existe.');
    }

    //Limpieza de cualquier reserva pendiente previa del usuario (Single active policy)
    await tx.reserva.deleteMany({
      where: {
        DNI: DNI,
        estado: ESTADOS_RESERVA.PENDIENTE,
      },
    });

    //Verificar que la función no haya comenzado
    if (subFunc <= now) {
      throw new Error('No se puede reservar para una función que ya ha comenzado.');
    }

    //verificar que la sala sea correcta para la función
    const funcion = await tx.funcion.findUnique({
      where: {
        idSala_fechaHoraFuncion: {
          idSala: idSala,
          fechaHoraFuncion: subFunc,
        },
      },
    });
    if (!funcion) {
      throw new Error('La función especificada no existe en la sala indicada.');
    }

    //Verificar que los asientos existen en la sala
    for (const asiento of asientos) {
      const asientoExistente = await tx.asiento.findUnique({
        where: {
          idSala_filaAsiento_nroAsiento: {
            idSala: idSala,
            filaAsiento: asiento.filaAsiento,
            nroAsiento: parseInt(asiento.nroAsiento, 10),
          },
        },
      });
      if (!asientoExistente) {
        throw new Error(
          `El asiento ${asiento.filaAsiento}${asiento.nroAsiento} no existe en la sala ${idSala}.`
        );
      }
    }

    //Verificar disponibilidad de asientos (Double-check concurrente)
    for (const asiento of asientos) {
      const busy = await tx.asiento_reserva.findUnique({
        where: {
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
            idSala,
            filaAsiento: asiento.filaAsiento,
            nroAsiento: parseInt(asiento.nroAsiento, 10),
            fechaHoraFuncion: subFunc,
          },
        },
      });
      if (busy) {
        throw new Error(
          `El asiento ${asiento.filaAsiento}${asiento.nroAsiento} ya no está disponible.`
        );
      }
    }

    // Calcular total
    var total = 0;
    for (const asiento of asientos) {
      const asientoInfo = await tx.asiento.findUnique({
        where: {
          idSala_filaAsiento_nroAsiento: {
            idSala,
            filaAsiento: asiento.filaAsiento,
            nroAsiento: parseInt(asiento.nroAsiento, 10),
          },
        },
        include: {
          tarifa: true,
        },
      });

      total += asientoInfo.tarifa.precio;
    }
    total = parseFloat(total);
    //---- FIN VALIDACIONES ----//

    //Crear la Reserva
    const newReserva = await tx.reserva.create({
      data: {
        estado: ESTADOS_RESERVA.PENDIENTE,
        fechaHoraReserva: subRes,
        total,
        usuario: {
          connect: { DNI },
        },
        funcion: {
          connect: {
            idSala_fechaHoraFuncion: {
              idSala: idSala,
              fechaHoraFuncion: subFunc,
            },
          },
        },
      },
    });

    //Crear los registros de Asientos Reservados
    const asientosToCreate = asientos.map((a) => ({
      idSala,
      filaAsiento: a.filaAsiento,
      nroAsiento: parseInt(a.nroAsiento, 10),
      fechaHoraFuncion: subFunc,
      DNI,
      fechaHoraReserva: subRes,
    }));

    await tx.asiento_reserva.createMany({
      data: asientosToCreate,
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
        estado: ESTADOS_RESERVA.CANCELADA,
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
      estado: ESTADOS_RESERVA.ACTIVA,
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
      fechaHoraReserva: 'desc',
    },
    take: limit,
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
      estado: ESTADOS_RESERVA.ACTIVA,
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
      estado: ESTADOS_RESERVA.PENDIENTE,
    },
  });
}

export {
  getOne,
  getAll,
  createWithSeats,
  deleteOne,
  cancel,
  getLatest,
  confirm,
  deletePendingByUser,
  getByUserAndStatus,
};
