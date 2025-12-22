import prisma from '../prisma/prisma.js';

/**
 * Obtiene todas las salas
 * @returns {Promise<Array>} Lista de salas
 */
async function getAll() {
  return await prisma.sala.findMany();
}

/**
 * Obtiene una sala por ID o Nombre
 * @param {string|number} param - ID o Nombre de la sala
 * @returns {Promise<Object|null>} Sala encontrada o null
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
 * Crea una nueva sala
 * @param {Object} data - Datos de la sala
 * @param {string} data.nombreSala - Nombre de la sala
 * @param {string} data.ubicacion - Ubicación
 * @param {number} data.filas - Cantidad de filas
 * @param {number} data.asientosPorFila - Asientos por fila
 * @returns {Promise<Object>} Sala creada
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
 * Elimina una sala por ID
 * @param {number} id - ID de la sala
 * @returns {Promise<Object>} Sala eliminada
 */
async function deleteOne(id) {
  return await prisma.sala.delete({
    where: {
      idSala: parseInt(id, 10),
    },
  });
}

/**
 * Actualiza una sala existente
 * @param {number} id - ID de la sala
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Sala actualizada
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
 * Cuenta todas las salas
 * @returns {Promise<number>} Cantidad de salas
 */
async function countAll() {
  return await prisma.sala.count();
}

/**
 * Busca salas por nombre o ubicación con límite opcional
 * @param {string} searchQuery - Término de búsqueda
 * @param {number} limit - Límite de resultados (opcional)
 * @returns {Promise<Array>} Lista de salas que coinciden con la búsqueda
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
