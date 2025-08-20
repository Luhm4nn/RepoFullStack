import axios from "axios";
import {formatToISO8601} from "../utils/dateFormater.js";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getFunciones = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Funciones`);
    return response.data;
  } catch (error) {
    console.error("Error fetching funciones:", error);
    throw error;
  }
}

export const createFuncion = async (funcion) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Funcion`, funcion);
    return response.data;
  } catch (error) {
    console.log(response.data);
    console.error("Error creating funcion:", error);
    throw error;
  }
}

export const updateFuncion = async (idSala, fechaHoraFuncion, funcion) => {
  try {
    const url = `${VITE_API_URL}/Funcion/${idSala}/${formatToISO8601(fechaHoraFuncion)}`;
    const response = await axios.put(url, funcion);
    return response.data;
  } catch (error) {
    console.error("Error updating funcion:", error);
    console.error("Error response:", error.response?.data);
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