import * as reportesRepository from './reportes.repository.js';
import { ESTADOS_RESERVA, MESES_ABREVIADOS } from '../constants/index.js';

/**
 * Obtiene métricas generales y rápidas para los contadores del dashboard.
 * @returns {Promise<Object>} Totales de películas, salas, usuarios, reservas hoy y funciones activas.
 */
export const getDashboardStats = async () => {
  return await reportesRepository.getDashboardStats();
};

/**
 * Procesa las reservas del último año para generar datos de ventas e ingresos mensuales.
 * @returns {Promise<Object>} Series de datos para gráficos de barras/líneas y etiquetas de meses.
 */
export const getVentasMensuales = async () => {
  const reservas = await reportesRepository.getReservasAnuales();

  const now = new Date();
  const categories = [];
  const ventasPorMes = Array(12).fill(0);
  const ingresosPorMes = Array(12).fill(0);

  // Generar etiquetas de los últimos 12 meses finalizando en el mes actual
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    categories.push(MESES_ABREVIADOS[monthDate.getMonth()]);
  }

  // Distribuir reservas en sus respectivos buckets mensuales
  reservas.forEach((reserva) => {
    const reservaDate = new Date(reserva.fechaHoraReserva);
    const monthsDiff = (now.getFullYear() - reservaDate.getFullYear()) * 12 + (now.getMonth() - reservaDate.getMonth());
    const monthIndex = 11 - monthsDiff;

    if (monthIndex >= 0 && monthIndex < 12) {
      ventasPorMes[monthIndex] += 1;
      ingresosPorMes[monthIndex] += Number(reserva.total);
    }
  });

  return {
    series: [
      { name: 'Ventas (Tickets)', data: ventasPorMes },
      { name: 'Ingresos ($)', data: ingresosPorMes },
    ],
    categories,
  };
};

/**
 * Calcula la relación entre reservas asistidas y no asistidas en los últimos 12 meses.
 * @returns {Promise<Object>} Datos formateados para gráficos comparativos de asistencia.
 */
export const getAsistenciaReservas = async () => {
  const reservas = await reportesRepository.getAsistenciaReservas();

  const now = new Date();
  const categories = [];
  const asistidasPorMes = Array(12).fill(0);
  const noAsistidasPorMes = Array(12).fill(0);

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    categories.push(MESES_ABREVIADOS[monthDate.getMonth()]);
  }

  reservas.forEach((reserva) => {
    const reservaDate = new Date(reserva.fechaHoraReserva);
    const monthsDiff = (now.getFullYear() - reservaDate.getFullYear()) * 12 + (now.getMonth() - reservaDate.getMonth());
    const monthIndex = 11 - monthsDiff;

    if (monthIndex >= 0 && monthIndex < 12) {
      if (reserva.estado === ESTADOS_RESERVA.ASISTIDA) {
        asistidasPorMes[monthIndex] += 1;
      } else if (reserva.estado === ESTADOS_RESERVA.NO_ASISTIDA) {
        noAsistidasPorMes[monthIndex] += 1;
      }
    }
  });

  return {
    series: [
      { name: 'Asistidas', data: asistidasPorMes },
      { name: 'No Asistidas', data: noAsistidasPorMes },
    ],
    categories,
  };
};

/**
 * Analiza la ocupación de las salas basada en ventas históricas vs capacidad teórica.
 * @returns {Promise<Object>} Porcentajes de ocupación por sala.
 */
export const getOcupacionSalas = async () => {
  const ocupacionRaw = await reportesRepository.getOcupacionRaw();

  const data = ocupacionRaw.map((o) => {
    const capacity = Number(o.capacidadPorFuncion) * Number(o.cantidadFunciones || 1);
    const sold = Number(o.totalAsientosVendidos);
    const percentage = capacity > 0 ? ((sold / capacity) * 100).toFixed(1) : 0;

    return {
      name: o.nombreSala,
      y: Number(percentage),
      sold: sold,
      capacity: capacity,
    };
  });

  return {
    series: data.map((d) => d.y),
    labels: data.map((d) => d.name),
  };
};

/**
 * Obtiene la película más reservada de cada mes en el último año.
 * @returns {Promise<Object>} Listado mensual con el título y cantidad de asientos vendidos.
 */
export const getPeliculasMasReservadas = async () => {
  const reservas = await reportesRepository.getPeliculasMasReservadas();

  const now = new Date();
  const categories = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    categories.push(MESES_ABREVIADOS[monthDate.getMonth()]);
  }

  const peliculasPorMes = Array(12).fill(null).map(() => ({}));

  reservas.forEach((reserva) => {
    const reservaDate = new Date(reserva.fechaHoraReserva);
    const monthsDiff = (now.getFullYear() - reservaDate.getFullYear()) * 12 + (now.getMonth() - reservaDate.getMonth());
    const monthIndex = 11 - monthsDiff;

    if (monthIndex >= 0 && monthIndex < 12) {
      const titulo = reserva.funcion?.pelicula?.nombrePelicula || 'Sin película';
      const cantidadAsientos = reserva.asiento_reserva.length;

      if (!peliculasPorMes[monthIndex][titulo]) {
        peliculasPorMes[monthIndex][titulo] = 0;
      }
      peliculasPorMes[monthIndex][titulo] += cantidadAsientos;
    }
  });

  const peliculasTop = [];
  const asientosTop = [];

  peliculasPorMes.forEach((mes) => {
    let maxPelicula = 'Sin datos';
    let maxAsientos = 0;

    Object.entries(mes).forEach(([pelicula, asientos]) => {
      if (asientos > maxAsientos) {
        maxAsientos = asientos;
        maxPelicula = pelicula;
      }
    });

    peliculasTop.push(maxPelicula);
    asientosTop.push(maxAsientos);
  });

  return {
    series: [
      { name: 'Asientos Reservados', data: asientosTop },
    ],
    categories,
    peliculas: peliculasTop,
  };
};

/**
 * Clasifica las películas en cartelera según el volumen total de reservas recientes.
 * @returns {Promise<Object>} Ranking de películas y cantidad de asientos reservados.
 */
export const getRankingPeliculasCartelera = async () => {
  const peliculas = await reportesRepository.getRankingPeliculasCartelera();

  const peliculasConAsientos = peliculas.map((pelicula) => {
    let totalAsientos = 0;

    pelicula.funcion.forEach((funcion) => {
      funcion.reserva.forEach((reserva) => {
        totalAsientos += reserva.asiento_reserva.length;
      });
    });

    return {
      nombre: pelicula.nombrePelicula,
      asientos: totalAsientos,
    };
  });

  peliculasConAsientos.sort((a, b) => b.asientos - a.asientos);

  return {
    peliculas: peliculasConAsientos.map((p) => p.nombre),
    asientos: peliculasConAsientos.map((p) => p.asientos),
  };
};
