import api from './axiosInstance.js';

export const getTarifas = async () => {
  try {
    const response = await api.get('/Tarifas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTarifa = async (idTarifa) => {
  try {
    const response = await api.get(`/Tarifa/${idTarifa}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTarifa = async (id, tarifa) => {
  try {
    const response = await api.put(`/Tarifa/${id}`, tarifa);
    return response.data;
  } catch (error) {
    throw error;
  }
};
