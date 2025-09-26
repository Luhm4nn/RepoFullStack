import axios from "axios";
import { dateFormaterBackend } from "../modules/shared";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Obtener todas las reservas
export const getReservas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Reservas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservas:", error);
    throw error;
  }
}

// Obtener una reserva específica
export const getReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const url = `${VITE_API_URL}/Reserva/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}/${DNI}/${dateFormaterBackend(fechaHoraReserva)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching reserva:", error);
    throw error;
  }
}

// Crear una nueva reserva
export const createReserva = async (reservaData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Reserva`, {
      idSala: reservaData.idSala,
      fechaHoraFuncion: dateFormaterBackend(reservaData.fechaHoraFuncion),
      DNI: reservaData.DNI,
      total: reservaData.total,
      fechaHoraReserva: reservaData.fechaHoraReserva || new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error("Error creating reserva:", error);
    throw error;
  }
}

// Cancelar una reserva
export const cancelReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const url = `${VITE_API_URL}/Reserva/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}/${DNI}/${dateFormaterBackend(fechaHoraReserva)}`;
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error("Error cancelling reserva:", error);
    throw error;
  }
}

// Eliminar una reserva
export const deleteReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    const url = `${VITE_API_URL}/Reserva/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}/${DNI}/${dateFormaterBackend(fechaHoraReserva)}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting reserva:", error);
    throw error;
  }
}

// Obtener reservas de un usuario
export const getReservasByUser = async (DNI) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Reservas?DNI=${DNI}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservas:", error);
    throw error;
  }
}