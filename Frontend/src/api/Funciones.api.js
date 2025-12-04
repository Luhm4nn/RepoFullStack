import api from './axiosInstance.js';
import { dateFormaterBackend } from '../modules/shared';

export const getFunciones = async (estado = 'activas') => {
  try {
    const response = await api.get(`/Funciones?estado=${estado}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching funciones:', error);
    throw error;
  }
};

export const getFuncionesActivas = async () => {
  return getFunciones('activas');
};

export const getFuncionesInactivas = async () => {
  return getFunciones('inactivas');
};

export const getTodasLasFunciones = async () => {
  return getFunciones('todos');
};

export const getFuncionesPublicas = async () => {
  return getFunciones('publicas');
}

export const createFuncion = async (funcion) => {
  try {
    const response = await api.post('/Funcion', funcion);
    return response.data;
  } catch (error) {
    console.error('Error creating funcion:', error);
    if (error.response && error.response.data && error.response.data.errors) {
      console.error('Errores de Validación del Servidor:', error.response.data.errors);
    } else if (error.response && error.response.data && error.response.data.message) {
      console.error('Mensaje del Servidor:', error.response.data.message);
    }
    throw error;
  }
};

export const updateFuncion = async (idSala, fechaHoraFuncion, funcion) => {
  try {
    const url = `/Funcion/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}`;
    const response = await api.put(url, funcion);
    return response.data;
  } catch (error) {
    console.error('Error updating funcion:', error);
    throw error;
  }
};

export const deleteFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const response = await api.delete(`/Funcion/${idSala}/${fechaHoraFuncion}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting funcion:', error);
    throw error;
  }
};

export const getFuncionesPorPeliculaYFecha = async (idPelicula, fecha) => {
  try {
    const response = await api.get(`/Funciones/${idPelicula}/${fecha}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching funciones por pelicula y fecha:', error);
    throw error;
  }
};

export const getFuncionesSemana = async (idPelicula) => {
  try {
    const response = await api.get(`/Funciones/${idPelicula}/semana`);
    return response.data;
  } catch (error) {
    console.error('Error fetching funciones por semana:', error);
    throw error;
  }
};
