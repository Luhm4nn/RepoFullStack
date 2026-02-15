import * as reportesService from './reportes.service.js';

/**
 * Obtiene estadísticas generales para el tablero de control principal.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getDashboardStats = async (req, res) => {
  const stats = await reportesService.getDashboardStats();
  res.json(stats);
};

/**
 * Recupera el desglose de ventas e ingresos mensuales de los últimos 12 meses.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getVentasMensuales = async (req, res) => {
  const data = await reportesService.getVentasMensuales();
  res.json(data);
};

/**
 * Genera el reporte de asistencia (Asistidas vs No Asistidas) del último año.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getAsistenciaReservas = async (req, res) => {
  const data = await reportesService.getAsistenciaReservas();
  res.json(data);
};

/**
 * Calcula el porcentaje de ocupación por sala basado en la capacidad y asientos vendidos.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getOcupacionSalas = async (req, res) => {
  const data = await reportesService.getOcupacionSalas();
  res.json(data);
};

/**
 * Identifica las películas con mayor número de reservas en los últimos meses.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getPeliculasMasReservadas = async (req, res) => {
  const data = await reportesService.getPeliculasMasReservadas();
  res.json(data);
};

/**
 * Genera un ranking de películas actualmente en cartelera según su popularidad.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getRankingPeliculasCartelera = async (req, res) => {
  const data = await reportesService.getRankingPeliculasCartelera();
  res.json(data);
};
