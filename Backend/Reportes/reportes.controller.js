import * as reportesService from './reportes.service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await reportesService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getVentasMensuales = async (req, res) => {
  try {
    const data = await reportesService.getVentasMensuales();
    res.json(data);
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    res.status(500).json({ message: 'Error fetching monthly sales' });
  }
};

export const getAsistenciaReservas = async (req, res) => {
  try {
    const data = await reportesService.getAsistenciaReservas();
    res.json(data);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'Error fetching attendance data' });
  }
};

export const getOcupacionSalas = async (req, res) => {
  try {
    const data = await reportesService.getOcupacionSalas();
    res.json(data);
  } catch (error) {
    console.error('Error fetching room occupancy:', error);
    res.status(500).json({ message: 'Error fetching occupancy' });
  }
};

export const getPeliculasMasReservadas = async (req, res) => {
  try {
    const data = await reportesService.getPeliculasMasReservadas();
    res.json(data);
  } catch (error) {
    console.error('Error fetching top movies:', error);
    res.status(500).json({ message: 'Error fetching top movies' });
  }
};

export const getRankingPeliculasCartelera = async (req, res) => {
  try {
    const data = await reportesService.getRankingPeliculasCartelera();
    res.json(data);
  } catch (error) {
    console.error('Error fetching movie ranking:', error);
    res.status(500).json({ message: 'Error fetching movie ranking' });
  }
};
