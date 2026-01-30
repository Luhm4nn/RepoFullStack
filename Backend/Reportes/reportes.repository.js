import prisma from '../prisma/prisma.js';

export const getDashboardStats = async () => {
  const [totalPeliculas, totalSalas, totalUsuarios, reservasHoy, totalFunciones] =
    await Promise.all([
      prisma.pelicula.count(),
      prisma.sala.count(),
      prisma.usuario.count({ where: { rol: 'CLIENTE' } }),
      prisma.reserva.count({
        where: {
          fechaHoraReserva: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          estado: 'ACTIVA',
        },
      }),
      prisma.funcion.count({
        where: {
          estado: 'Publica',
          fechaHoraFuncion: {
            gte: new Date(),
          },
        },
      }),
    ]);

  return {
    totalPeliculas,
    totalSalas,
    totalUsuarios,
    reservasHoy,
    totalFunciones,
  };
};

export const getReservasAnuales = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        not: 'PENDIENTE',
      },
    },
    select: {
      fechaHoraReserva: true,
      total: true,
    },
  });
};

export const getAsistenciaReservas = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        in: ['ASISTIDA', 'NO_ASISTIDA'],
      },
    },
    select: {
      fechaHoraReserva: true,
      estado: true,
    },
  });
};

export const getOcupacionRaw = async () => {
  return await prisma.$queryRaw`
        SELECT 
            s."nombreSala",
            (s.filas * s."asientosPorFila") as "capacidadPorFuncion",
            COUNT(ar."nroAsiento") as "totalAsientosVendidos",
            COUNT(DISTINCT f."fechaHoraFuncion") as "cantidadFunciones"
        FROM sala s
        LEFT JOIN funcion f ON s."idSala" = f."idSala"
        LEFT JOIN reserva r ON f."idSala" = r."idSala" AND f."fechaHoraFuncion" = r."fechaHoraFuncion" AND r.estado = 'ACTIVA'
        LEFT JOIN asiento_reserva ar ON r."idSala" = ar."idSala" AND r."fechaHoraFuncion" = ar."fechaHoraFuncion" AND r."DNI" = ar."DNI" AND r."fechaHoraReserva" = ar."fechaHoraReserva"
        GROUP BY s."idSala", s."nombreSala", s.filas, s."asientosPorFila"
    `;
};

export const getPeliculasMasReservadas = async () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate,
      },
      estado: {
        not: 'PENDIENTE',
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

export const getRankingPeliculasCartelera = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Definir rango para "En Cartelera" (Misma logica que en peliculas.service.js)
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);

  return await prisma.pelicula.findMany({
    where: {
      funcion: {
        some: {
          estado: 'Publica',
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
                not: 'PENDIENTE',
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
