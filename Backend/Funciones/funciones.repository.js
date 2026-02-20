import prisma from '../prisma/prisma.js';
import { ESTADOS_FUNCION, ESTADOS_RESERVA } from '../constants/index.js';

/**
 * Actualiza automáticamente a INACTIVA las funciones que ya han pasado su fecha
 * @param {Date} now - Fecha y hora actual
 * @returns {Promise<Object>} Resultado de la actualización
 */
async function autoInactivarVencidas(now) {
  return await prisma.funcion.updateMany({
    where: {
      estado: { not: ESTADOS_FUNCION.INACTIVA },
      fechaHoraFuncion: { lte: now },
    },
    data: {
      estado: ESTADOS_FUNCION.INACTIVA,
    },
  });
}

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
      estado: ESTADOS_FUNCION.PRIVADA,
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
 * Obtiene funciones inactivas con paginación
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Items por página (default: 10)
 * @returns {Promise<Object>} Objeto con data y pagination
 */
async function getInactive(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const now = new Date();

  const [data, total] = await Promise.all([
    prisma.funcion.findMany({
      where: {
        OR: [{ estado: ESTADOS_FUNCION.INACTIVA }, { fechaHoraFuncion: { lte: now } }],
      },
      include: {
        sala: true,
        pelicula: true,
      },
      orderBy: {
        fechaHoraFuncion: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.funcion.count({
      where: {
        OR: [{ estado: ESTADOS_FUNCION.INACTIVA }, { fechaHoraFuncion: { lte: now } }],
      },
    }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtiene funciones activas (no inactivas) con paginación
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Items por página (default: 10)
 * @returns {Promise<Object>} Objeto con data y pagination
 */
async function getActive(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const now = new Date();

  const [data, total] = await Promise.all([
    prisma.funcion.findMany({
      where: {
        estado: { not: ESTADOS_FUNCION.INACTIVA },
        fechaHoraFuncion: { gt: now },
      },
      include: {
        sala: true,
        pelicula: true,
      },
      orderBy: {
        fechaHoraFuncion: 'asc',
      },
      skip,
      take: limit,
    }),
    prisma.funcion.count({
      where: {
        estado: { not: ESTADOS_FUNCION.INACTIVA },
        fechaHoraFuncion: { gt: now },
      },
    }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtiene funciones públicas
 * @returns {Promise<Array>} Lista de funciones públicas
 */
async function getPublic() {
  return await prisma.funcion.findMany({
    where: { estado: ESTADOS_FUNCION.PUBLICA },
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
    where: { estado: ESTADOS_FUNCION.PUBLICA },
  });
}

/**
 * Obtiene una función con estadísticas de ocupación y ganancia
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.idSala - ID de la sala
 * @param {string|Date} params.fechaHoraFuncion - Fecha y hora de la función
 * @returns {Promise<Object|null>} Función con estadísticas o null
 */
async function getOneWithStats({ idSala, fechaHoraFuncion }) {
  const funcionDate = new Date(fechaHoraFuncion);
  funcionDate.setMilliseconds(0);

  // Obtener la función con sus relaciones
  const funcion = await prisma.funcion.findUnique({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala, 10),
        fechaHoraFuncion: funcionDate,
      },
    },
    include: {
      sala: true,
      pelicula: true,
    },
  });

  if (!funcion) {
    return null;
  }

  // Contar asientos reservados
  const asientosReservados = await prisma.asiento_reserva.count({
    where: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: funcionDate,
    },
  });

  // Sumar ganancia de reservas activas
  const gananciaStats = await prisma.reserva.aggregate({
    where: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: funcionDate,
      estado: ESTADOS_RESERVA.ACTIVA,
    },
    _sum: {
      total: true,
    },
  });

  return {
    ...funcion,
    asientosReservados: asientosReservados || 0,
    gananciaTotal: Number(gananciaStats._sum.total) || 0,
  };
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
async function getWithFilters(filters = {}, page = 1, limit = 10) {
  const where = {};

  // Filtro por película (ID tiene prioridad sobre nombre)
  if (filters.idPelicula) {
    where.idPelicula = parseInt(filters.idPelicula, 10);
  } else if (filters.nombrePelicula) {
    // Filtro por nombre de película (texto)
    where.pelicula = {
      nombrePelicula: {
        contains: filters.nombrePelicula,
        mode: 'insensitive',
      },
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
            mode: 'insensitive',
          },
        },
        {
          ubicacion: {
            contains: filters.nombreSala,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  if (filters.estado) {
    const estadoUpper = filters.estado.toUpperCase();
    const now = new Date();
    // Funciones activas incluyen todas menos Inactivas que sean futuras
    if (estadoUpper === 'ACTIVA' || estadoUpper === 'ACTIVAS') {
      where.estado = { not: ESTADOS_FUNCION.INACTIVA };
      where.fechaHoraFuncion = { gt: now };
    } else if (estadoUpper === 'INACTIVA' || estadoUpper === 'INACTIVAS') {
      where.OR = [{ estado: ESTADOS_FUNCION.INACTIVA }, { fechaHoraFuncion: { lte: now } }];
    } else {
      where.estado = estadoUpper;
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

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.funcion.findMany({
      where,
      include: {
        sala: true,
        pelicula: true,
      },
      orderBy: {
        fechaHoraFuncion: 'asc',
      },
      skip,
      take: limit,
    }),
    prisma.funcion.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
  getOneWithStats,
  getWithFilters,
  autoInactivarVencidas,
};
