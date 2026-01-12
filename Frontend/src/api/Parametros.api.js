import api from './axiosInstance.js';

export const getParametros = async () => {
  try {
    const response = await api.get('/Parametros');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createParametro = async (parametro) => {
  try {
    const response = await api.post('/Parametro', parametro);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateParametro = async (id, parametro) => {
  try {
    const response = await api.put(`/Parametro/${id}`, parametro);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteParametro = async (id) => {
  try {
    const response = await api.delete(`/Parametro/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};