import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los asientos reservados
 * @returns {Promise<Array>} Lista de asientos reservados
 */
async function getAll() {
  return await prisma.asiento_reserva.findMany();
}

const removeMilliseconds = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    const newDate = new Date(date);
    newDate.setMilliseconds(0);
    return newDate;
  }
  const newDate = new Date(date);
  newDate.setMilliseconds(0);
  return newDate;
};

/**
 * Obtiene asientos reservados por función
 * @param {number} idSala - ID de la sala
 * @param {Date} fechaFuncionDate - Fecha de la función
 * @returns {Promise<Array>} Lista de asientos reservados
 */
async function getByFuncion(idSala, fechaFuncionDate) {
  const fecha = new Date(fechaFuncionDate);
  fecha.setMilliseconds(0);
  
  return await prisma.asiento_reserva.findMany({
    where: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: fecha,
    },
  });
}

/**
 * Obtiene un asiento reservado específico
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object|null>} Asiento reservado encontrado o null
 */
async function getOne({ idSala, filaAsiento, nroAsiento, fechaHoraFuncion }) {
  return await prisma.asiento_reserva.findUnique({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
  });
}

/**
 * Crea múltiples reservas de asientos
 * @param {Array} reservasArray - Lista de reservas a crear
 * @returns {Promise<Object>} Resultado de la creación masiva
 */
async function createMany(reservasArray) {
  const dataToCreate = reservasArray.map((item, index) => {
    const idSala = parseInt(item.idSala, 10);
    const nroAsiento = parseInt(item.nroAsiento, 10);
    const DNI = parseInt(item.DNI, 10);

    if (isNaN(idSala) || isNaN(nroAsiento) || isNaN(DNI)) {
      throw new Error(`Datos inválidos en asiento ${index}`);
    }

    const fechaFuncion = removeMilliseconds(item.fechaHoraFuncion);
    const fechaReserva = removeMilliseconds(item.fechaHoraReserva);

    if (!fechaFuncion || !fechaReserva) {
      throw new Error(`Fechas inválidas en asiento ${index}`);
    }

    return {
      idSala,
      filaAsiento: item.filaAsiento,
      nroAsiento,
      fechaHoraFuncion: fechaFuncion,
      DNI,
      fechaHoraReserva: fechaReserva,
    };
  });

  return await prisma.asiento_reserva.createMany({
    data: dataToCreate,
    skipDuplicates: true,
  });
}

/**
 * Elimina una reserva de asiento
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Reserva eliminada
 */
async function deleteOne({ idSala, filaAsiento, nroAsiento, fechaHoraFuncion }) {
  return await prisma.asiento_reserva.delete({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
  });
}

/**
 * Actualiza una reserva de asiento
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Reserva actualizada
 */
async function update({ idSala, filaAsiento, nroAsiento, fechaHoraFuncion }, data) {
  return await prisma.asiento_reserva.update({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
    data: {
      idSala: parseInt(data.idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      fechaHoraFuncion: removeMilliseconds(data.fechaHoraFuncion),
      DNI: parseInt(data.DNI, 10),
      fechaHoraReserva: removeMilliseconds(data.fechaHoraReserva),
    },
  });
}

export {
  getOne,
  getAll,
  createMany,
  deleteOne,
  update,
  getByFuncion,
};
