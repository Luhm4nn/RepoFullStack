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
    throw error;
  }
};

export const getUserReservas = async (estado = null) => {
  try {
    const url = estado
      ? `/Reservas/user?estado=${estado}`
      : '/Reservas/user';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene el código QR de una reserva
 * @param {number} idSala - ID de la sala
 * @param {string} fechaHoraFuncion - Fecha y hora de la función
 * @param {number} DNI - DNI del usuario
 * @param {string} fechaHoraReserva - Fecha y hora de la reserva
 * @returns {Promise<Object>} Objeto con el QR code en formato data URL
 */
export const getReservaQR = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}/qr`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * Confirma una reserva pendiente
 */
export const confirmReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}/confirm`;
    const response = await api.patch(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * Elimina una reserva pendiente del usuario (limpieza)
 */
export const deletePendingReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));

    const url = `/Reserva/pending/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
