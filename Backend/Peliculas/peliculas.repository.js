import prisma from '../prisma/prisma.js';

/**
 * Parse ID de forma segura
 * @param {*} id - ID a parsear
 * @param {string} fieldName - Nombre del campo para el error
 * @returns {number} ID parseado
 */
/**
 * Parsea un ID de forma segura a entero.
 * @param {*} id - Valor a parsear.
 * @param {string} fieldName - Nombre del campo para el mensaje de error.
 * @returns {number} Valor entero.
 * @throws {Error} Si el valor no es un número válido.
 */
function safeParseInt(id, fieldName = 'ID') {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} inválido`);
  }
  return parsed;
}

/**
 * Recupera todas las películas usando Prisma.
 * @returns {Promise<Array>} Lista de películas.
 */
async function getAll() {
  return await prisma.pelicula.findMany();
}

/**
 * Obtiene películas con paginación desde la base de datos.
 * @param {number} page - Página actual.
 * @param {number} limit - Cantidad de registros.
 * @returns {Promise<Object>} Datos y metadatos de paginación.
 */
async function getPaginated(page = 1, limit = 10) {
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
 * Busca una película por su ID.
 * @param {number|string} id - ID de la película.
 * @returns {Promise<Object|null>} Registro encontrado o null.
 */
async function getOne(id) {
  return await prisma.pelicula.findUnique({
    where: {
      idPelicula: safeParseInt(id, 'ID de película'),
    },
  });
}

/**
 * Crea un nuevo registro de película.
 * @param {Object} data - Datos del registro.
 * @returns {Promise<Object>} Registro creado.
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
/**
 * Elimina una película por su ID.
 * @param {number|string} id - ID de la película.
 * @returns {Promise<Object>} Registro eliminado.
 */
async function deleteOne(id) {
  return await prisma.pelicula.delete({
    where: {
      idPelicula: safeParseInt(id, 'ID de película'),
    },
  });
}

/**
 * Actualiza los datos de una película existente.
 * @param {number|string} id - ID de la película.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} Registro actualizado.
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
 * Obtiene películas que tienen funciones marcadas como 'Publica'.
 * @param {Date} ahora - Fecha de inicio.
 * @param {Date} semana - Fecha de fin.
 * @returns {Promise<Array>} Lista de películas en cartelera.
 */
async function getAllEnCartelera(ahora, semana) {
  return await prisma.pelicula.findMany({
    where: {
      funcion: {
        some: {
          fechaHoraFuncion: {
            gte: ahora,
            lte: semana,
          },
          estado: 'PUBLICA',
        },
      },
    },
  });
}

/**
 * Cuenta películas en cartelera.
 * @param {Date} hoy - Fecha hoy.
 * @param {Date} semana - Fecha fin de semana.
 * @returns {Promise<number>} Cantidad de películas.
 */
async function countEnCartelera(hoy, semana) {
  return await prisma.pelicula.count({
    where: {
      funcion: {
        some: {
          fechaHoraFuncion: {
            gte: hoy,
            lte: semana,
          },
          estado: 'PUBLICA',
        },
      },
    },
  });
}

/**
 * Busca películas por nombre con coincidencia parcial.
 * @param {string} searchQuery - Cadena de búsqueda.
 * @param {number} limit - Límite de resultados.
 * @returns {Promise<Array>} Películas que coinciden.
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
 * Filtra películas dinámicamente por búsqueda y género con paginación.
 * @param {Object} filters - Filtros dinámicos.
 * @param {number} page - Página.
 * @param {number} limit - Límite.
 * @returns {Promise<Object>} Resultados paginados.
 */
async function getWithFilters(filters = {}, page = 1, limit = 10) {
  const where = {};

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

  if (filters.genero) {
    where.generoPelicula = {
      contains: filters.genero,
      mode: 'insensitive'
    };
  }

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
 * Recupera películas con estreno futuro.
 * @returns {Promise<Array>} Lista de estrenos.
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

