import api from './axiosInstance.js';

export const getDashboardStats = async () => {
  const response = await api.get('/reportes/stats');
  return response.data;
};

export const getVentasMensuales = async () => {
  const response = await api.get('/reportes/ventas-mensuales');
  return response.data;
};

export const getAsistenciaReservas = async () => {
  const response = await api.get('/reportes/asistencia-reservas');
  return response.data;
};

export const getOcupacionSalas = async () => {
  const response = await api.get('/reportes/ocupacion-salas');
  return response.data;
};

export const getPeliculasMasReservadas = async () => {
  const response = await api.get('/reportes/peliculas-mas-reservadas');
  return response.data;
};

export const getRankingPeliculasCartelera = async () => {
  const response = await api.get('/reportes/ranking-cartelera');
  return response.data;
};
