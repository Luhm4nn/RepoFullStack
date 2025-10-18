import axios from "axios";
// Asumo que dateFormaterBackend convierte una Date a un string ISO
import { dateFormaterBackend } from "../modules/shared"; 

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ... (getAsientoReservas se mantiene igual)

// CORRECCIÓN 1: Obtener asientos reservados para una función específica
// Usaremos la nueva ruta del backend (GET /AsientoReservas/:idSala/:fechaHoraFuncion)
export const getAsientosReservadosPorFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const fechaFormateada = dateFormaterBackend(fechaHoraFuncion);
    const encodedFechaFuncion = encodeURIComponent(fechaFormateada);
    const url = `${VITE_API_URL}/AsientoReservas/${idSala}/${encodedFechaFuncion}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching asientos reservados por función:", error);
    throw error;
  }
}

export const createAsientosReservados = async (asientosData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/AsientoReserva`, asientosData);
    
    return response.data;
  } catch (error) {
    console.error("Error creating asientos reservados:", error);
    throw error;
  }
}
