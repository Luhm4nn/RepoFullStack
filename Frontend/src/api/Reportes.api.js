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
