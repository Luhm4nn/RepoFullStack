import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getParametros = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Parametros`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parametros:", error);
    throw error;
  }
}

export const createParametro = async (parametro) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Parametro`, parametro);
    return response.data;
  } catch (error) {
    console.error("Error creating parametro:", error);
    throw error;
  }
}

export const updateParametro = async (id, parametro) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/Parametro/${id}`, parametro);
    return response.data;
  } catch (error) {
    console.error("Error updating parametro:", error);
    throw error;
  }
}

export const deleteParametro = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Parametro/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting parametro:", error);
    throw error;
  }
}