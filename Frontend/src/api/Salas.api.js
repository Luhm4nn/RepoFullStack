import api from './axiosInstance.js';

export const getSalas = async () => {
  try {
    const response = await api.get('/Salas');
    return response.data;
  } catch (error) {
    console.error('Error fetching salas:', error);
    throw error;
  }
};

export const searchSalas = async (query, limit = 5) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get('/Salas');
    const salas = response.data;

    const filteredSalas = salas
      .filter((sala) => sala.nombreSala && sala.nombreSala.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);

    return filteredSalas;
  } catch (error) {
    console.error('Error searching salas:', error);
    throw error;
  }
};

export const getSala = async (param) => {
  try {
    const response = await api.get(`/Sala/${param}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sala:', error);
    throw error;
  }
};

export const createSala = async (sala) => {
  try {
    const response = await api.post('/Sala', sala);
    return response.data;
  } catch (error) {
    console.error('Error creating sala:', error);
    throw error;
  }
};

export const updateSala = async (id, sala) => {
  try {
    const response = await api.put(`/Sala/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error('Error updating sala:', error);
    throw error;
  }
};

export const deleteSala = async (id) => {
  try {
    const response = await api.delete(`/Sala/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sala:', error);
    throw error;
  }
};

export const getAsientosBySala = async (id) => {
  try {
    const idSala = parseInt(id, 10);
    const response = await api.get(`/Sala/${idSala}/Asientos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los asientos de la sala:', error);
    throw error;
  }
};
