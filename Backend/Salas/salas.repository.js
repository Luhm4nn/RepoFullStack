import prisma from '../prisma/prisma.js';

/**
 * Recupera todas las salas mediante Prisma.
 * @returns {Promise<Array>} Listado de salas.
 */
async function getAll() {
  return await prisma.sala.findMany();
}

/**
 * Busca una sala por su ID numérico o por su nombre único.
 * @param {string|number} param - Valor a buscar.
 * @returns {Promise<Object|null>} Sala encontrada o null.
 */
async function getOne(param) {
  if (!isNaN(param)) {
    return await prisma.sala.findUnique({
      where: { idSala: parseInt(param, 10) },
    });
  } else {
    return await prisma.sala.findUnique({
      where: { nombreSala: param },
    });
  }
}

/**
 * Crea un registro de sala con dimensiones básicas.
 * @param {Object} data - Datos de la sala.
 * @returns {Promise<Object>} Registro creado.
 */
async function create(data) {
  return await prisma.sala.create({
    data: {
      nombreSala: data.nombreSala,
      ubicacion: data.ubicacion,
      filas: data.filas,
      asientosPorFila: data.asientosPorFila,
    },
  });
}

/**
 * Elimina físicamente una sala por su ID.
 * @param {number|string} id - ID de la sala.
 * @returns {Promise<Object>} Registro eliminado.
 */
async function deleteOne(id) {
  return await prisma.sala.delete({
    where: {
      idSala: parseInt(id, 10),
    },
  });
}

/**
 * Actualiza el nombre o ubicación de una sala existente.
 * @param {number|string} id - ID de la sala.
 * @param {Object} data - Nuevos datos.
 * @returns {Promise<Object>} Registro actualizado.
 */
async function update(id, data) {
  return await prisma.sala.update({
    where: {
      idSala: parseInt(id, 10),
    },
    data: {
      nombreSala: data.nombreSala,
      ubicacion: data.ubicacion,
    },
  });
}

/**
 * Obtiene el total de salas registradas.
 * @returns {Promise<number>} Cantidad de salas.
 */
async function countAll() {
  return await prisma.sala.count();
}

/**
 * Busca salas con coincidencia de texto en nombre o ubicación.
 * @param {string} searchQuery - Término de búsqueda.
 * @param {number} limit - Límite de resultados opcional.
 * @returns {Promise<Array>} Listado filtrado.
 */
async function search(searchQuery, limit) {
  const where = searchQuery
    ? {
        OR: [
          {
            nombreSala: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            ubicacion: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {};

  const options = {
    where,
    orderBy: {
      nombreSala: 'asc',
    },
  };

  if (limit && !isNaN(limit) && limit > 0) {
    options.take = parseInt(limit, 10);
  }

  return await prisma.sala.findMany(options);
}

export { getAll, getOne, create, deleteOne, update, countAll, search };
