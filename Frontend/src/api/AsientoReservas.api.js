import api from './axiosInstance.js';
import { dateFormaterBackend } from '../modules/shared';

export const getAsientosReservadosPorFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const fechaFormateada = dateFormaterBackend(fechaHoraFuncion);
    const encodedFechaFuncion = encodeURIComponent(fechaFormateada);
    const url = `/AsientoReservas/${idSala}/${encodedFechaFuncion}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAsientosReservados = async (asientosData) => {
  try {
    const response = await api.post('/AsientoReserva', asientosData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
