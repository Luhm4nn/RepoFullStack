import prisma from '../prisma/prisma.js';

export const getDashboardStats = async () => {
  const [totalPeliculas, totalSalas, totalUsuarios, reservasHoy] = await Promise.all([
    prisma.pelicula.count(),
    prisma.sala.count(),
    prisma.usuario.count({ where: { rol: 'CLIENTE' } }),
    prisma.reserva.count({
      where: {
        fechaHoraReserva: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    })
  ]);

  return {
    totalPeliculas,
    totalSalas,
    totalUsuarios,
    reservasHoy
  };
};

export const getReservasAnuales = async () => {
  // Last 12 months from current month
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate
      },
      estado: {
        not: 'PENDIENTE'}
    },
    select: {
      fechaHoraReserva: true,
      total: true
    }
  });
};


export const getAsistenciaReservas = async () => {
  // Last 12 months from current month
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
  return await prisma.reserva.findMany({
    where: {
      fechaHoraReserva: {
        gte: startDate
      },
      estado: {
        in: ['ASISTIDA', 'NO_ASISTIDA']
      }
    },
    select: {
      fechaHoraReserva: true,
      estado: true
    }
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
        LEFT JOIN reserva r ON f."idSala" = r."idSala" AND f."fechaHoraFuncion" = r."fechaHoraFuncion" AND r.estado = 'CONFIRMADA'
        LEFT JOIN asiento_reserva ar ON r."idSala" = ar."idSala" AND r."fechaHoraFuncion" = ar."fechaHoraFuncion" AND r."DNI" = ar."DNI" AND r."fechaHoraReserva" = ar."fechaHoraReserva"
        GROUP BY s."idSala", s."nombreSala", s.filas, s."asientosPorFila"
    `;
};
