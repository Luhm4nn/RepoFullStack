import api from './axiosInstance.js';
import { dateFormaterBackend } from '../modules/shared';

// Función principal con query params (usa el backend optimizado)
export const getFunciones = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Si solo hay estado, mantener compatibilidad con rutas antiguas
    if (typeof filtros === 'string') {
      const response = await api.get(`/Funciones?estado=${filtros}`);
      return response.data;
    }
    
    // Filtros avanzados con query params
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.idPelicula) params.append('idPelicula', filtros.idPelicula);
    if (filtros.nombrePelicula) params.append('nombrePelicula', filtros.nombrePelicula);
    if (filtros.idSala) params.append('idSala', filtros.idSala);
    if (filtros.nombreSala) params.append('nombreSala', filtros.nombreSala);
    if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const queryString = params.toString();
    const url = queryString ? `/Funciones?${queryString}` : '/Funciones';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFuncionesActivas = async () => {
  return getFunciones({ estado: 'activas' });
};

export const getFuncionesInactivas = async () => {
  return getFunciones({ estado: 'inactivas' });
};

export const getTodasLasFunciones = async () => {
  return getFunciones();
};

export const getFuncionesPublicas = async () => {
  return getFunciones({ estado: 'publicas' });
};

export const createFuncion = async (funcion) => {
  try {
    const response = await api.post('/Funcion', funcion);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFuncion = async (idSala, fechaHoraFuncion, funcion) => {
  try {
    const url = `/Funcion/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}`;
    const response = await api.put(url, funcion);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const response = await api.delete(`/Funcion/${idSala}/${fechaHoraFuncion}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFuncionesPorPeliculaYFecha = async (idPelicula, fecha) => {
  try {
    const response = await api.get(`/Funciones/${idPelicula}/${fecha}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFuncionesSemana = async (idPelicula) => {
  try {
    const response = await api.get(`/Funciones/${idPelicula}/semana`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCountFuncionesPublicas = async () => {
  try {
    const response = await api.get('/Funciones/publicas/count');
    return response.data.count;
  } catch (error) {
    throw error;
  }
};
