import prisma from '../prisma/prisma.js';

/**
 * Obtiene todas las funciones
 * @returns {Promise<Array>} Lista de funciones
 */
async function getAll() {
  return await prisma.funcion.findMany({
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene una función específica
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.idSala - ID de la sala
 * @param {string|Date} params.fechaHoraFuncion - Fecha y hora de la función
 * @returns {Promise<Object|null>} Función encontrada o null
 */
async function getOne({ idSala, fechaHoraFuncion }) {
  return await prisma.funcion.findUnique({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
  });
}

/**
 * Crea una nueva función
 * @param {Object} data - Datos de la función
 * @returns {Promise<Object>} Función creada
 */
async function create(data) {
  return await prisma.funcion.create({
    data: {
      fechaHoraFuncion: new Date(data.fechaHoraFuncion),
      idSala: parseInt(data.idSala, 10),
      idPelicula: parseInt(data.idPelicula, 10),
      estado: 'Privada',
    },
  });
}

/**
 * Elimina una función
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Función eliminada
 */
async function deleteOne({ idSala, fechaHoraFuncion }) {
  return await prisma.funcion.delete({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
  });
}

/**
 * Actualiza una función
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Función actualizada
 */
async function update({ idSala, fechaHoraFuncion }, data) {
  return await prisma.funcion.update({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: new Date(fechaHoraFuncion),
      },
    },
    data: {
      idSala: parseInt(data.idSala, 10),
      fechaHoraFuncion: new Date(data.fechaHoraFuncion),
      idPelicula: parseInt(data.idPelicula, 10),
      estado: data.estado,
    },
  });
}

/**
 * Obtiene funciones por sala
 * @param {number} idSala - ID de la sala
 * @returns {Promise<Array>} Lista de funciones
 */
async function getBySala(idSala) {
  return await prisma.funcion.findMany({
    where: {
      idSala: parseInt(idSala, 10),
    },
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene funciones por película
 * @param {number} idPelicula - ID de la película
 * @returns {Promise<Array>} Lista de funciones
 */
async function getByPelicula(idPelicula) {
  return await prisma.funcion.findMany({
    where: {
      idPelicula: parseInt(idPelicula, 10),
    },
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene funciones inactivas
 * @returns {Promise<Array>} Lista de funciones inactivas
 */
async function getInactive() {
  return await prisma.funcion.findMany({
    where: { estado: 'Inactiva' },
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene funciones activas (no inactivas)
 * @returns {Promise<Array>} Lista de funciones activas
 */
async function getActive() {
  return await prisma.funcion.findMany({
    where: { estado: { not: 'Inactiva' } },
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene funciones públicas
 * @returns {Promise<Array>} Lista de funciones públicas
 */
async function getPublic() {
  return await prisma.funcion.findMany({
    where: { estado: 'Publica' },
    include: {
      sala: true,
      pelicula: true,
    },
  });
}

/**
 * Obtiene funciones por película y fecha
 * @param {number} idPelicula - ID de la película
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Promise<Array>} Lista de funciones
 */
async function getByPeliculaAndFecha(idPelicula, fecha) {
  const fechaInicio = new Date(fecha + 'T00:00:00');
  const fechaFin = new Date(fecha + 'T23:59:59.999');
  return await prisma.funcion.findMany({
    where: {
      idPelicula: parseInt(idPelicula, 10),
      fechaHoraFuncion: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    },
    include: {
      sala: true,
    },
  });
}

/**
 * Obtiene funciones de una película en un rango de fechas
 * @param {number} idPelicula - ID de la película
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Array>} Lista de funciones
 */
async function getByPeliculaAndRange(idPelicula, fechaInicio, fechaFin) {
  return await prisma.funcion.findMany({
    where: {
      idPelicula: parseInt(idPelicula, 10),
      fechaHoraFuncion: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    },
    include: {
      sala: true,
    },
  });
}

/**
 * Cuenta funciones públicas
 * @returns {Promise<number>} Cantidad de funciones públicas
 */
async function countPublic() {
  return await prisma.funcion.count({
    where: { estado: 'Publica' },
  });
}

/**
 * Obtiene funciones con filtros dinámicos
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} filters.idPelicula - ID de película (opcional)
 * @param {number} filters.idSala - ID de sala (opcional)
 * @param {string} filters.estado - Estado de la función (opcional)
 * @param {string} filters.fechaDesde - Fecha desde (opcional)
 * @param {string} filters.fechaHasta - Fecha hasta (opcional)
 * @param {number} filters.limit - Límite de resultados (opcional)
 * @returns {Promise<Array>} Lista de funciones filtradas
 */
async function getWithFilters(filters = {}) {
  const where = {};

  // Filtro por película (ID tiene prioridad sobre nombre)
  if (filters.idPelicula) {
    where.idPelicula = parseInt(filters.idPelicula, 10);
  } else if (filters.nombrePelicula) {
    // Filtro por nombre de película (texto)
    where.pelicula = {
      nombrePelicula: {
        contains: filters.nombrePelicula,
        mode: 'insensitive'
      }
    };
  }

  // Filtro por sala (ID, nombre o ubicación)
  if (filters.idSala) {
    where.idSala = parseInt(filters.idSala, 10);
  } else if (filters.nombreSala) {
    // Filtro por nombre de sala O ubicación (búsqueda en ambos campos)
    where.sala = {
      OR: [
        {
          nombreSala: {
            contains: filters.nombreSala,
            mode: 'insensitive'
          }
        },
        {
          ubicacion: {
            contains: filters.nombreSala,
            mode: 'insensitive'
          }
        }
      ]
    };
  }

  if (filters.estado) {
    const estadoLower = filters.estado.toLowerCase();
    // Funciones activas incluyen todas menos Inactivas
    if (estadoLower === 'activas') {
      where.estado = { not: 'Inactiva' };
    }  else {
      where.estado = filters.estado;
    }
  }

  if (filters.fechaDesde || filters.fechaHasta) {
    where.fechaHoraFuncion = {};
    if (filters.fechaDesde) {
      where.fechaHoraFuncion.gte = new Date(filters.fechaDesde);
    }
    if (filters.fechaHasta) {
      where.fechaHoraFuncion.lte = new Date(filters.fechaHasta);
    }
  }

  const options = {
    where,
    include: {
      sala: true,
      pelicula: true,
    },
    orderBy: {
      fechaHoraFuncion: 'asc',
    },
  };

  if (filters.limit && !isNaN(filters.limit) && filters.limit > 0) {
    options.take = parseInt(filters.limit, 10);
  }

  return await prisma.funcion.findMany(options);
}

export {
  getAll,
  getOne,
  create,
  deleteOne,
  update,
  getBySala,
  getByPelicula,
  getInactive,
  getActive,
  getPublic,
  getByPeliculaAndFecha,
  getByPeliculaAndRange,
  countPublic,
  getWithFilters,
};
