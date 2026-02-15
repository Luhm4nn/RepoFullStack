import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los asientos de una sala incluyendo relaciones.
 * @param {number|string} idSala - ID de la sala.
 * @returns {Promise<Array>} Listado de asientos.
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
 * Recupera un asiento específico mediante su clave compuesta (sala, fila, número).
 * @param {Object} params - Identificadores.
 * @returns {Promise<Object|null>} Asiento o null.
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
 * Genera masivamente los asientos para una sala nueva basándose en filas y columnas.
 * Identifica asientos VIP según la lista proporcionada.
 * 
 * @param {number} idSala - ID de la sala.
 * @param {number} filas - Cantidad total de filas.
 * @param {number} asientosPorFila - Cantidad de asientos por fila.
 * @param {Array} vipSeats - IDs de asientos que serán de categoría VIP (ej. ['A1', 'A2']).
 * @returns {Promise<Object>} Resultado de la creación.
 */
async function createManyForSala(idSala, filas, asientosPorFila, vipSeats = []) {
  const asientosToCreate = [];
  const parsedIdSala = parseInt(idSala, 10);
  const parsedFilas = parseInt(filas, 10);
  const parsedAsientosPorFila = parseInt(asientosPorFila, 10);

  for (let i = 0; i < parsedFilas; i++) {
    const filaLetter = String.fromCharCode(65 + i);

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
 * Crea un registro manual de asiento.
 * @param {number|string} idSala - ID de la sala.
 * @param {Object} data - Datos del asiento.
 * @returns {Promise<Object>} Registro creado.
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
 * Permite actualizar masivamente qué asientos son VIP para una sala determinada.
 * Resetea todos a 'Normal' antes de marcar los nuevos VIP.
 * 
 * @param {number|string} idSala - ID de la sala.
 * @param {Array} vipSeats - Lista de IDs de asientos VIP (ej: ["A1", "A2"]).
 * @returns {Promise<Array>} Lista de registros actualizados.
 */
async function updateManyForSala(idSala, vipSeats = []) {
  const parsedIdSala = parseInt(idSala, 10);

  // Primero resetear todos a Normal
  await prisma.asiento.updateMany({
    where: {
      idSala: parsedIdSala,
    },
    data: {
      tipo: 'Normal',
      idTarifa: 1,
    },
  });

  const results = [];
  if (Array.isArray(vipSeats)) {
    for (const seatId of vipSeats) {
      if (typeof seatId !== 'string') continue;
      const filaMatch = seatId.match(/[A-Z]+/);
      const nroMatch = seatId.match(/\d+/);
      
      if (!filaMatch || !nroMatch) continue;

      const filaAsiento = filaMatch[0];
      const nroAsiento = parseInt(nroMatch[0], 10);

      try {
        const updated = await prisma.asiento.update({
          where: {
            idSala_filaAsiento_nroAsiento: {
              idSala: parsedIdSala,
              filaAsiento,
              nroAsiento,
            },
          },
          data: {
            tipo: 'VIP',
            idTarifa: 2,
          },
        });
        results.push(updated);
      } catch (err) {
        // Ignorar si un asiento específico no existe
      }
    }
  }
  return results;
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
