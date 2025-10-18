import axios from "axios";


import { dateFormaterBackend } from "../modules/shared"; 

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getReservas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Reservas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservas:", error);
    throw error;
  }
}

export const getReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));
    
    const url = `${VITE_API_URL}/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching reserva:", error);
    throw error;
  }
}

export const createReserva = async (reservaData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Reserva`, {
      idSala: reservaData.idSala,
      fechaHoraFuncion: reservaData.fechaHoraFuncion, 
      DNI: reservaData.DNI,
      total: reservaData.total,
      fechaHoraReserva: reservaData.fechaHoraReserva 
    });
    return response.data;
  } catch (error) {
    console.error("Error creating reserva:", error);
    throw error;
  }
}

export const cancelReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));
    
    const url = `${VITE_API_URL}/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error("Error cancelling reserva:", error);
    throw error;
  }
}

export const deleteReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const encodedFechaFuncion = encodeURIComponent(dateFormaterBackend(fechaHoraFuncion));
    const encodedFechaReserva = encodeURIComponent(dateFormaterBackend(fechaHoraReserva));
    
    const url = `${VITE_API_URL}/Reserva/${idSala}/${encodedFechaFuncion}/${DNI}/${encodedFechaReserva}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting reserva:", error);
    throw error;
  }
}

export const getReservasByUser = async (DNI) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Reservas?DNI=${DNI}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservas:", error);
    throw error;
  }
}
