import axios from "axios";
// Asumo que dateFormaterBackend convierte una Date a un string ISO,
// y que la importación de '../modules/shared' es correcta
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
    // CORRECCIÓN: Se usa encodeURIComponent para codificar los caracteres ':' y '.' en las fechas de la URL.
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

// Crear una nueva reserva
export const createReserva = async (reservaData) => {
  try {
    // CORRECCIÓN: Se asume que reservaData.fechaHoraFuncion ya es un string ISO
    // desde el frontend (ReservaPage.jsx) y se elimina la doble conversión.
    // Además, fechaHoraReserva ya viene en reservaData desde ReservaPage.jsx
    const response = await axios.post(`${VITE_API_URL}/Reserva`, {
      idSala: reservaData.idSala,
      fechaHoraFuncion: reservaData.fechaHoraFuncion, // Ya debe ser string ISO
      DNI: reservaData.DNI,
      total: reservaData.total,
      fechaHoraReserva: reservaData.fechaHoraReserva // Ya debe ser string ISO (desde new Date().toISOString() en ReservaPage.jsx)
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
    // CORRECCIÓN: Se usa encodeURIComponent para codificar los caracteres ':' y '.' en las fechas de la URL.
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

// Eliminar una reserva
export const deleteReserva = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva) => {
  try {
    // CORRECCIÓN: Se usa encodeURIComponent para codificar los caracteres ':' y '.' en las fechas de la URL.
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

// Obtener reservas de un usuario
export const getReservasByUser = async (DNI) => {
  try {
    // NOTA: Para query parameters (después de ?), Axios maneja la codificación, 
    // por lo que no es necesario encodeURIComponent(DNI).
    const response = await axios.get(`${VITE_API_URL}/Reservas?DNI=${DNI}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservas:", error);
    throw error;
  }
}