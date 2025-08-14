import axios from "axios";

export const getParametros = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/Parametros`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parametros:", error);
    throw error;
  }
}

export const createParametro = async (parametro) => {
  try {
    const response = await axios.post(`http://localhost:4000/Parametro`, parametro);
    return response.data;
  } catch (error) {
    console.error("Error creating parametro:", error);
    throw error;
  }
}

export const updateParametro = async (id, parametro) => {
  try {
    const response = await axios.put(`http://localhost:4000/Parametro/${id}`, parametro);
    return response.data;
  } catch (error) {
    console.error("Error updating parametro:", error);
    throw error;
  }
}

export const deleteParametro = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/Parametro/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting parametro:", error);
    throw error;
  }
}