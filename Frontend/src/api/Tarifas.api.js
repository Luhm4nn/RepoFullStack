import api from './axiosInstance.js';

export const getTarifas = async () => {
  try {
    const response = await api.get('/Tarifas');
    return response.data;
  } catch (error) {
    console.error('Error fetching tarifas:', error);
    throw error;
  }
};

export const getTarifa = async (idTarifa) => {
  try {
    const response = await api.get(`/Tarifa/${idTarifa}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tarifa:', error);
    throw error;
  }
};

export const createTarifa = async (tarifa) => {
  try {
    const response = await api.post('/Tarifa', tarifa);
    return response.data;
  } catch (error) {
    console.error('Error creating tarifa:', error);
    throw error;
  }
};

export const updateTarifa = async (id, tarifa) => {
  try {
    const response = await api.put(`/Tarifa/${id}`, tarifa);
    return response.data;
  } catch (error) {
    console.error('Error updating tarifa:', error);
    throw error;
  }
};

export const deleteTarifa = async (id) => {
  try {
    const response = await api.delete(`/Tarifa/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tarifa:', error);
    throw error;
  }
};
