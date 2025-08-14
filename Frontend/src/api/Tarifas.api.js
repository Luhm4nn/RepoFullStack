import axios from "axios";

export const getTarifas = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/Tarifas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tarifas:", error);
    throw error;
  }
}

export const createTarifa = async (tarifa) => {
  try {
    const response = await axios.post(`http://localhost:4000/Tarifa`, tarifa);
    return response.data;
  } catch (error) {
    console.error("Error creating tarifa:", error);
    throw error;
  }
}

export const updateTarifa = async (id, tarifa) => {
  try {
    const response = await axios.put(`http://localhost:4000/Tarifa/${id}`, tarifa);
    return response.data;
  } catch (error) {
    console.error("Error updating tarifa:", error);
    throw error;
  }
}

export const deleteTarifa = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/Tarifa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tarifa:", error);
    throw error;
  }
}