import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getTarifas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Tarifas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tarifas:", error);
    throw error;
  }
}

export const createTarifa = async (tarifa) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Tarifa`, tarifa);
    return response.data;
  } catch (error) {
    console.error("Error creating tarifa:", error);
    throw error;
  }
}

export const updateTarifa = async (id, tarifa) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/Tarifa/${id}`, tarifa);
    return response.data;
  } catch (error) {
    console.error("Error updating tarifa:", error);
    throw error;
  }
}

export const deleteTarifa = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Tarifa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tarifa:", error);
    throw error;
  }
}