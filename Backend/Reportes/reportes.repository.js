import prisma from '../prisma/prisma.js';
import * as peliculasRepository from '../Peliculas/peliculas.repository.js';
import * as salasRepository from '../Salas/salas.repository.js';
import * as funcionesRepository from '../Funciones/funciones.repository.js';
import * as reservasRepository from '../Funciones/reservas.repository.js';
import { ESTADOS_FUNCION, ESTADOS_RESERVA } from '../constants/index.js';

/**
 * Realiza un conteo masivo de entidades clave para el dashboard.
 * Utiliza las funciones de conteo específicas de cada módulo.
 * @returns {Promise<Object>} Conteos de Películas en cartelera, Salas, Reservas activas hoy y Funciones públicas.
 * @deprecated Usar los endpoints específicos de cada módulo en su lugar:
 *   - GET /Peliculas/cartelera/count
 *   - GET /Salas/count
 *   - GET /Funciones/publicas/count
 *   - GET /Reservas/count/today
 */
export const getDashboardStats = async () => {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  const now = new Date();

  // Inactivamos funciones vencidas antes de contar para asegurar datos actualizados
  await funcionesRepository.autoInactivarVencidas(now);

  const [totalPeliculas, totalSalas, totalFunciones, reservasHoy] = await Promise.all([
    peliculasRepository.countEnCartelera(inicio, fin),
    salasRepository.countAll(),
    funcionesRepository.countPublic(),
    reservasRepository.countActiveTodayReservas(),
  ]);

  return {
    totalPeliculas,
    totalSalas,
    totalFunciones,
    reservasHoy,
  };
};

/**
 * Recupera todas las reservas no pendientes de los últimos 11 meses.
 * @returns {Promise<Array>} Listado de fechas y montos totales.
 */
export const getReservasAnuales = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        not: ESTADOS_RESERVA.PENDIENTE,
      },
    },
    select: {
      fechaHoraReserva: true,
      total: true,
    },
  });
};

/**
 * Obtiene el histórico de asistencia del último año.
 * @returns {Promise<Array>} Registros con estado ASISTIDA o NO_ASISTIDA.
 */
export const getAsistenciaReservas = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        in: [ESTADOS_RESERVA.ASISTIDA, ESTADOS_RESERVA.NO_ASISTIDA],
      },
    },
    select: {
      fechaHoraReserva: true,
      estado: true,
    },
  });
};

/**
 * Ejecuta una consulta SQL nativa para calcular la ocupación real por sala.
 * @returns {Promise<Array>} Resultados agregados por sala.
 */
export const getOcupacionRaw = async () => {
  return await prisma.$queryRaw`
        SELECT 
            s."nombreSala",
            (s.filas * s."asientosPorFila") as "capacidadPorFuncion",
            COUNT(ar."nroAsiento") as "totalAsientosVendidos",
            COUNT(DISTINCT f."fechaHoraFuncion") as "cantidadFunciones"
        FROM sala s
        LEFT JOIN funcion f ON s."idSala" = f."idSala"
        LEFT JOIN reserva r ON f."idSala" = r."idSala" AND f."fechaHoraFuncion" = r."fechaHoraFuncion" AND r.estado = ${ESTADOS_RESERVA.ACTIVA}
        LEFT JOIN asiento_reserva ar ON r."idSala" = ar."idSala" AND r."fechaHoraFuncion" = ar."fechaHoraFuncion" AND r."DNI" = ar."DNI" AND r."fechaHoraReserva" = ar."fechaHoraReserva"
        GROUP BY s."idSala", s."nombreSala", s.filas, s."asientosPorFila"
    `;
};

/**
 * Busca las reservas detalladas del último año incluyendo películas y asientos.
 * @returns {Promise<Array>} Reservas con relación a Funciones y Películas.
 */
export const getPeliculasMasReservadas = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        not: ESTADOS_RESERVA.PENDIENTE,
      },
    },
    select: {
      fechaHoraReserva: true,
      funcion: {
        select: {
          pelicula: {
            select: {
              nombrePelicula: true,
            },
          },
        },
      },
      asiento_reserva: {
        select: {
          nroAsiento: true,
        },
      },
    },
  });
};

/**
 * Genera el ranking de películas en cartelera basado en funciones públicas actuales.
 * @returns {Promise<Array>} Películas con sus funciones y volumen de reservas.
 */
export const getRankingPeliculasCartelera = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setDate(fin.getDate() + 30); // Aumentamos a 30 días para ser más inclusivos en el ranking
  fin.setHours(23, 59, 59, 999);

  return await prisma.pelicula.findMany({
    where: {
      funcion: {
        some: {
          estado: ESTADOS_FUNCION.PUBLICA,
          fechaHoraFuncion: {
            gte: inicio,
            lte: fin,
          },
        },
      },
    },
    select: {
      idPelicula: true,
      nombrePelicula: true,
      portada: true,
      funcion: {
        select: {
          reserva: {
            where: {
              estado: {
                not: ESTADOS_RESERVA.PENDIENTE,
              },
              fechaHoraReserva: {
                gte: oneMonthAgo,
              },
            },
            select: {
              asiento_reserva: {
                select: {
                  nroAsiento: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
