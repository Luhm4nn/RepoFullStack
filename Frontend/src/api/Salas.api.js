import axios from "axios";

export const getSalas = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/Salas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
}

export const createSala = async (sala) => {
  try {
    const response = await axios.post(`http://localhost:4000/Sala`, sala);
    return response.data;
  } catch (error) {
    console.error("Error creating sala:", error);
    throw error;
  }
}

export const updateSala = async (id, sala) => {
  try {
    const response = await axios.put(`http://localhost:4000/Sala/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error("Error updating sala:", error);
    throw error;
  }
}

export const deleteSala = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/Sala/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sala:", error);
    throw error;
  }
}

export const getAsientosBySala = async (id) => {
  try {
    const idSala = parseInt(id, 10);
    const response = await axios.get(`http://localhost:4000/Sala/${idSala}/Asientos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los asientos de la sala:", error);
    throw error;
  }
};