import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getSalas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Salas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
}

export const createSala = async (sala) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Sala`, sala);
    return response.data;
  } catch (error) {
    console.error("Error creating sala:", error);
    throw error;
  }
}

export const updateSala = async (id, sala) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/Sala/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error("Error updating sala:", error);
    throw error;
  }
}

export const deleteSala = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Sala/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sala:", error);
    throw error;
  }
}

export const getAsientosBySala = async (id) => {
  try {
    const idSala = parseInt(id, 10);
    const response = await axios.get(`${VITE_API_URL}/Sala/${idSala}/Asientos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los asientos de la sala:", error);
    throw error;
  }
};
