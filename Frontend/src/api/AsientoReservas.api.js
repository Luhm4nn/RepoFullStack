import axios from "axios";
// Asumo que dateFormaterBackend convierte una Date a un string ISO
import { dateFormaterBackend } from "../modules/shared"; 

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ... (getAsientoReservas se mantiene igual)

// CORRECCIÓN 1: Obtener asientos reservados para una función específica
// Usaremos la nueva ruta del backend (GET /AsientoReservas/:idSala/:fechaHoraFuncion)
export const getAsientosReservadosPorFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    // 🔍 AGREGAR DEBUG
    console.log('📅 API - fechaHoraFuncion recibida:', fechaHoraFuncion);
    console.log('📅 API - tipo:', typeof fechaHoraFuncion);
    
    const fechaFormateada = dateFormaterBackend(fechaHoraFuncion);
    console.log('📅 API - fecha formateada:', fechaFormateada);
    
    const encodedFechaFuncion = encodeURIComponent(fechaFormateada);
    console.log('📅 API - fecha encoded:', encodedFechaFuncion);
    
    const url = `${VITE_API_URL}/AsientoReservas/${idSala}/${encodedFechaFuncion}`;
    console.log('📅 API - URL completa:', url);
    
    const response = await axios.get(url);
    console.log('📅 API - respuesta:', response.data);
    
    return response.data;
  } catch (error) {
    // ...
  }
}

// CORRECCIÓN 2: Crear múltiples asientos reservados en una sola llamada POST
export const createAsientosReservados = async (asientosData) => {
  try {
    // Enviar el array de reservas directamente en el cuerpo
    // La ruta es /AsientoReserva (la que tiene tu POST)
    const response = await axios.post(`${VITE_API_URL}/AsientoReserva`, asientosData);
    
    return response.data;
  } catch (error) {
    console.error("Error creating asientos reservados:", error);
    throw error;
  }
}

// CORRECCIÓN 3: Eliminar o consolidar createAsientoReservado ya que no se usa y complica el diseño
// La dejo comentada por si la necesitas:
/*
export const createAsientoReservado = async (asientoData) => {
  // Ya no es necesaria si usamos createAsientosReservados, a menos que el backend se modifique
  // para tener una ruta individual y una ruta de array.
}
*/

// ... (deleteAsientoReservado se mantiene igual)