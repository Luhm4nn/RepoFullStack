import axios from "axios";
import { dateFormaterBackend } from "../modules/shared";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Obtener todos los asientos reservados
export const getAsientoReservas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/AsientoReservas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching asiento reservas:", error);
    throw error;
  }
}

// Obtener asientos reservados para una función específica
// Como el backend no soporta query params, obtenemos todos y filtramos en el cliente
export const getAsientosReservadosPorFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/AsientoReservas`);
    const fechaFormateada = dateFormaterBackend(fechaHoraFuncion);
    
    // Filtrar por idSala y fechaHoraFuncion
    const filtered = response.data.filter(asiento => {
      const asientoFecha = dateFormaterBackend(asiento.fechaHoraFuncion);
      return asiento.idSala === parseInt(idSala, 10) && asientoFecha === fechaFormateada;
    });
    
    return filtered;
  } catch (error) {
    console.error("Error fetching asientos reservados por funcion:", error);
    // Si no hay asientos reservados, retornar array vacío
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

// Crear múltiples asientos reservados
export const createAsientosReservados = async (asientosData) => {
  try {
    const promises = asientosData.map(asiento => 
      axios.post(`${VITE_API_URL}/AsientoReserva`, {
        idSala: asiento.idSala,
        filaAsiento: asiento.filaAsiento,
        nroAsiento: asiento.nroAsiento,
        fechaHoraFuncion: dateFormaterBackend(asiento.fechaHoraFuncion),
        DNI: asiento.DNI,
        fechaHoraReserva: asiento.fechaHoraReserva || new Date().toISOString()
      })
    );
    
    const responses = await Promise.all(promises);
    return responses.map(r => r.data);
  } catch (error) {
    console.error("Error creating asientos reservados:", error);
    throw error;
  }
}

// Crear un asiento reservado individual
export const createAsientoReservado = async (asientoData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/AsientoReserva`, {
      idSala: asientoData.idSala,
      filaAsiento: asientoData.filaAsiento,
      nroAsiento: asientoData.nroAsiento,
      fechaHoraFuncion: dateFormaterBackend(asientoData.fechaHoraFuncion),
      DNI: asientoData.DNI,
      fechaHoraReserva: asientoData.fechaHoraReserva || new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error("Error creating asiento reservado:", error);
    throw error;
  }
}

// Eliminar un asiento reservado
export const deleteAsientoReservado = async (idSala, fechaHoraFuncion, DNI, fechaHoraReserva, filaAsiento, nroAsiento) => {
  try {
    const url = `${VITE_API_URL}/Reserva/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}/${DNI}/${dateFormaterBackend(fechaHoraReserva)}/Asiento/${filaAsiento}/${nroAsiento}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting asiento reservado:", error);
    throw error;
  }
}