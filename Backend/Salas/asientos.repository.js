import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los asientos de una sala
 * @param {number} idSala - ID de la sala
 * @returns {Promise<Array>} Lista de asientos
 */
async function getAll(idSala) {
  return await prisma.asiento.findMany({
    where: {
      idSala: parseInt(idSala, 10),
    },
    include: {
      tarifa: true,
      sala: true,
    },
  });
}

/**
 * Obtiene un asiento específico
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.idSala - ID de la sala
 * @param {string} params.filaAsiento - Fila del asiento
 * @param {number} params.nroAsiento - Número del asiento
 * @returns {Promise<Object|null>} Asiento encontrado o null
 */
async function getOne({ idSala, filaAsiento, nroAsiento }) {
  return await prisma.asiento.findUnique({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
      },
    },
  });
}

/**
 * Crea múltiples asientos para una sala
 * @param {number} idSala - ID de la sala
 * @param {number} filas - Cantidad de filas
 * @param {number} asientosPorFila - Asientos por fila
 * @param {Array} vipSeats - Lista de asientos VIP
 * @returns {Promise<Object>} Resultado de la creación masiva
 */
async function createManyForSala(idSala, filas, asientosPorFila, vipSeats = []) {
  const asientosToCreate = [];
  const parsedIdSala = parseInt(idSala, 10);
  const parsedFilas = parseInt(filas, 10);
  const parsedAsientosPorFila = parseInt(asientosPorFila, 10);

  for (let i = 0; i < parsedFilas; i++) {
    const filaLetter = String.fromCharCode(65 + i); // A, B, C, D...

    for (let nroAsiento = 1; nroAsiento <= parsedAsientosPorFila; nroAsiento++) {
      const seatId = `${filaLetter}${nroAsiento}`;
      const tipo = vipSeats.includes(seatId) ? 'VIP' : 'Normal';
      const idTarifa = tipo === 'VIP' ? 2 : 1;

      asientosToCreate.push({
        idSala: parsedIdSala,
        filaAsiento: filaLetter,
        nroAsiento: nroAsiento,
        tipo: tipo,
        idTarifa: idTarifa,
      });
    }
  }

  return await prisma.asiento.createMany({
    data: asientosToCreate,
  });
}

/**
 * Crea un asiento individual
 * @param {number} idSala - ID de la sala
 * @param {Object} data - Datos del asiento
 * @returns {Promise<Object>} Asiento creado
 */
async function create(idSala, data) {
  return await prisma.asiento.create({
    data: {
      idSala: parseInt(idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      tipo: data.tipo,
      idTarifa: data.idTarifa ? parseInt(data.idTarifa, 10) : null,
    },
  });
}

/**
 * Elimina un asiento
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Asiento eliminado
 */
async function deleteOne({ idSala, filaAsiento, nroAsiento }) {
  return await prisma.asiento.delete({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
      },
    },
  });
}

/**
 * Actualiza un asiento
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Asiento actualizado
 */
async function update({ idSala, filaAsiento, nroAsiento }, data) {
  return await prisma.asiento.update({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala, 10),
        filaAsiento: filaAsiento,
        nroAsiento: parseInt(nroAsiento, 10),
      },
    },
    data: {
      tipo: data.tipo,
      idTarifa: data.idTarifa ? parseInt(data.idTarifa, 10) : null,
    },
  });
}

/**
 * Actualiza múltiples asientos para una sala (VIP/Normal)
 * @param {number} idSala - ID de la sala
 * @param {Array} vipSeats - Lista de asientos VIP
 * @returns {Promise<Array>} Lista de asientos VIP actualizados
 */
async function updateManyForSala(idSala, vipSeats = []) {
  const parsedIdSala = parseInt(idSala, 10);

  try {
    // Resetear todos a Normal
    await prisma.asiento.updateMany({
      where: {
        idSala: parsedIdSala,
      },
      data: {
        tipo: 'Normal',
        idTarifa: 1,
      },
    });

    const updatedVipSeats = [];

    if (Array.isArray(vipSeats) && vipSeats.length > 0) {
      for (const seat of vipSeats) {
        if (typeof seat !== 'string' || seat.length < 2) continue;

        const filaAsiento = seat.charAt(0);
        const nroAsiento = parseInt(seat.slice(1), 10);

        if (isNaN(nroAsiento)) continue;

        try {
          await prisma.asiento.update({
            where: {
              idSala_filaAsiento_nroAsiento: {
                idSala: parsedIdSala,
                filaAsiento: filaAsiento,
                nroAsiento: nroAsiento,
              },
            },
            data: {
              tipo: 'VIP',
              idTarifa: 2,
            },
          });
          updatedVipSeats.push(seat);
        } catch (error) {
          // Ignorar errores individuales
        }
      }
    }

    return updatedVipSeats;
  } catch (error) {
    throw error;
  }
}

export { 
  getOne, 
  getAll, 
  createManyForSala, 
  create, 
  deleteOne, 
  update, 
  updateManyForSala 
};
