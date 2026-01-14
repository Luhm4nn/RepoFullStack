import prisma from '../prisma/prisma.js';

/**
 * Parse ID de forma segura
 * @param {*} id - ID a parsear
 * @param {string} fieldName - Nombre del campo para el error
 * @returns {number} ID parseado
 */
function safeParseInt(id, fieldName = 'ID') {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} inválido`);
  }
  return parsed;
}

/**
 * Obtiene todas las películas
 * @returns {Promise<Array>} Lista de películas
 */
async function getAll() {
  return await prisma.pelicula.findMany();
}

/**
 * Obtiene películas con paginación
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Items por página (default: 10)
 * @returns {Promise<Object>} Objeto con data y pagination
 */
async function getPaginated(page = 1, limit = 10) {
  // Asegurar que page y limit sean números válidos
  const validPage = parseInt(page) || 1;
  const validLimit = parseInt(limit) || 10;
  const skip = (validPage - 1) * validLimit;
  
  const [data, total] = await Promise.all([
    prisma.pelicula.findMany({
      orderBy: {
        nombrePelicula: 'asc',
      },
      skip,
      take: validLimit,
    }),
    prisma.pelicula.count(),
  ]);

  return {
    data,
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
    },
  };
}

/**
 * Obtiene una película por ID
 * @param {number} id - ID de la película
 * @returns {Promise<Object|null>} Película encontrada o null
 */
async function getOne(id) {
  return await prisma.pelicula.findUnique({
    where: {
      idPelicula: safeParseInt(id, 'ID de película'),
    },
  });
}

/**
 * Crea una nueva película
 * @param {Object} data - Datos de la película
 * @returns {Promise<Object>} Película creada
 */
async function create(data) {
  return await prisma.pelicula.create({
    data: {
      nombrePelicula: data.nombrePelicula,
      duracion: data.duracion,
      generoPelicula: data.generoPelicula,
      director: data.director,
      fechaEstreno: data.fechaEstreno,
      sinopsis: data.sinopsis,
      trailerURL: data.trailerURL,
      portada: data.portada,
      portadaPublicId: data.portadaPublicId,
      MPAA: data.MPAA,
    },
  });
}

/**
 * Elimina una película por ID
 * @param {number} id - ID de la película
 * @returns {Promise<Object>} Película eliminada
 */
async function deleteOne(id) {
  return await prisma.pelicula.delete({
    where: {
      idPelicula: safeParseInt(id, 'ID de película'),
    },
  });
}

/**
 * Actualiza una película existente
 * @param {number} id - ID de la película
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Película actualizada
 */
async function update(id, data) {
  return await prisma.pelicula.update({
    where: {
      idPelicula: safeParseInt(id, 'ID de película'),
    },
    data: {
      nombrePelicula: data.nombrePelicula,
      duracion: data.duracion,
      generoPelicula: data.generoPelicula,
      director: data.director,
      fechaEstreno: data.fechaEstreno,
      sinopsis: data.sinopsis,
      trailerURL: data.trailerURL,
      portada: data.portada,
      portadaPublicId: data.portadaPublicId,
      MPAA: data.MPAA,
    },
  });
}

/**
 * Obtiene películas que tienen funciones públicas (en cartelera)
 * @returns {Promise<Array>} Lista de películas en cartelera
 */
async function getAllEnCartelera() {
  return await prisma.pelicula.findMany({
    where: {
      funcion: {
        some: {
          estado: 'Publica',
        },
      },
    },
  });
}

/**
 * Cuenta películas que tienen funciones públicas (en cartelera)
 * @returns {Promise<number>} Cantidad de películas en cartelera
 */
async function countEnCartelera() {
  return await prisma.pelicula.count({
    where: {
      funcion: {
        some: {
          estado: 'Publica',
        },
      },
    },
  });
}

/**
 * Busca películas por nombre con límite opcional
 * @param {string} searchQuery - Término de búsqueda
 * @param {number} limit - Límite de resultados (opcional)
 * @returns {Promise<Array>} Lista de películas que coinciden con la búsqueda
 */
async function search(searchQuery, limit) {
  const where = searchQuery
    ? {
        nombrePelicula: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }
    : {};

  const options = {
    where,
    orderBy: {
      nombrePelicula: 'asc',
    },
  };

  if (limit && !isNaN(limit) && limit > 0) {
    options.take = parseInt(limit, 10);
  }

  return await prisma.pelicula.findMany(options);
}

/**
 * Obtiene películas con filtros dinámicos y paginación
 * @param {Object} filters - Filtros de búsqueda
 * @param {string} filters.busqueda - Búsqueda por nombre de película o director
 * @param {string} filters.genero - Filtro por género
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Items por página (default: 10)
 * @returns {Promise<Object>} Objeto con data y pagination
 */
async function getWithFilters(filters = {}, page = 1, limit = 10) {
  const where = {};

  // Filtro de búsqueda: busca en nombre de película O director
  if (filters.busqueda) {
    where.OR = [
      {
        nombrePelicula: {
          contains: filters.busqueda,
          mode: 'insensitive'
        }
      },
      {
        director: {
          contains: filters.busqueda,
          mode: 'insensitive'
        }
      }
    ];
  }

  // Filtro por género
  if (filters.genero) {
    where.generoPelicula = {
      contains: filters.genero,
      mode: 'insensitive'
    };
  }

  // Asegurar que page y limit sean números válidos
  const validPage = parseInt(page) || 1;
  const validLimit = parseInt(limit) || 10;
  const skip = (validPage - 1) * validLimit;

  const [data, total] = await Promise.all([
    prisma.pelicula.findMany({
      where,
      orderBy: {
        nombrePelicula: 'asc',
      },
      skip,
      take: validLimit,
    }),
    prisma.pelicula.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
    },
  };
}

/**
 * Obtiene películas cuya fecha de estreno es posterior a hoy
 * @returns {Promise<Array>} Lista de películas próximas a estrenarse
 */
async function getEstrenos() {
  const today = new Date();
  
  return await prisma.pelicula.findMany({
    where: {
      fechaEstreno: {
        gt: today,
      },
    },
    orderBy: {
      fechaEstreno: 'asc',
    },
  });
}

export { getOne, getAll, getPaginated, create, deleteOne, update, getAllEnCartelera, countEnCartelera, search, getWithFilters, getEstrenos };
