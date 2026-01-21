import prisma from '../prisma/prisma.js';

/**
 * Obtiene una reserva con todos sus detalles relacionados
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object|null>} Reserva con detalles o null
 */
export async function getReservaWithDetails({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  return await prisma.reserva.findUnique({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: fechaHoraFuncion,
        DNI: parseInt(DNI, 10),
        fechaHoraReserva: fechaHoraReserva,
      },
    },
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
          fechaHoraFuncion: true,
        },
      },
      usuario: {
        select: {
          DNI: true,
          nombreUsuario: true,
          apellidoUsuario: true,
          email: true,
        },
      },
      asiento_reserva: {
        include: {
          asiento: true,
        },
      },
    },
  });
}

/**
 * Marca una reserva como asistida
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva actualizada
 */
export async function markReservaAsUsed({ idSala, fechaHoraFuncion, DNI, fechaHoraReserva }) {
  return await prisma.reserva.update({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: fechaHoraFuncion,
        DNI: parseInt(DNI, 10),
        fechaHoraReserva: fechaHoraReserva,
      },
    },
    data: {
      estado: 'ASISTIDA',
    },
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
        },
      },
      usuario: {
        select: {
          DNI: true,
          nombreUsuario: true,
          apellidoUsuario: true,
          email: true,
        },
      },
    },
  });
}
