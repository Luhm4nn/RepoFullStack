import api from './axiosInstance.js';
import { dateFormaterBackend } from '../modules/shared';

export const getReservas = async () => {
  try {
    const response = await api.get('/Reservas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLatestReservas = async (limit = 5) => {
  try {
    const response = await api.get(`/Reservas/latest?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest reservas:", error);
    throw error;
  }
};

export const createReserva = async (reservaData) => {
  try {
    const response = await api.post('/Reserva', {
      idSala: reservaData.idSala,
      fechaHoraFuncion: reservaData.fechaHoraFuncion,
      DNI: reservaData.DNI,
      total: reservaData.total,
      fechaHoraReserva: reservaData.fechaHoraReserva,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await api.put(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservasByUser = async (DNI) => {
  try {
    const response = await api.get(`/Reservas?DNI=${DNI}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reservas:', error);
    throw error;
  }
};

export const getUserReservas = async () => {
  try {
    const response = await api.get('/Reservas/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user reservas:', error);
    throw error;
  }
};


