import axios from "axios";
import {dateFormaterBackend} from "../utils/dateFormater.js";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getFunciones = async (estado = 'activas') => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Funciones?estado=${estado}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching funciones:", error);
    throw error;
  }
}

// Funciones específicas para mejor claridad en el código
export const getFuncionesActivas = async () => {
  return getFunciones('activas');
}

export const getFuncionesInactivas = async () => {
  return getFunciones('inactivas');
}

export const getTodasLasFunciones = async () => {
  return getFunciones('todos');
}

export const createFuncion = async (funcion) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Funcion`, funcion);
    return response.data;
  } catch (error) {
    console.error("Error creating funcion:", error);
    throw error;
  }
}

export const updateFuncion = async (idSala, fechaHoraFuncion, funcion) => {
  try {
    const url = `${VITE_API_URL}/Funcion/${idSala}/${dateFormaterBackend(fechaHoraFuncion)}`;
    const response = await axios.put(url, funcion);
    return response.data;
  } catch (error) {
    console.error("Error updating funcion:", error);
    throw error;
  }
}

export const deleteFuncion = async (idSala, fechaHoraFuncion) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Funcion/${idSala}/${fechaHoraFuncion}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting funcion:", error);
    throw error;
  }
}

export const getFuncionesPorPeliculaYFecha = async (idPelicula, fecha) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Funciones`, {
      params: { idPelicula, fecha }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching funciones por pelicula y fecha:", error);
    throw error;
  }
};