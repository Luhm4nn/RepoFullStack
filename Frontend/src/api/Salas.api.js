import api from './axiosInstance.js';

export const getSalas = async () => {
  try {
    const response = await api.get('/Salas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSala = async (id) => {
  try {
    const response = await api.get(`/Sala/${id}`);
    return response.data;
  } catch (error) {
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

    return salas
      .filter((sala) =>
        sala.nombreSala?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
  } catch (error) {
    throw error;
  }
};

export const createSala = async (sala) => {
  try {
    const response = await api.post('/Sala', sala);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSala = async (id, sala) => {
  try {
    const response = await api.put(`/Sala/${id}`, sala);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSala = async (id) => {
  try {
    const response = await api.delete(`/Sala/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAsientosBySala = async (id) => {
  try {
    const idSala = parseInt(id, 10);
    const response = await api.get(`/Sala/${idSala}/Asientos`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCountSalas = async () => {
  try {
    const response = await api.get('/Salas/count');
    return response.data.count;
  } catch (error) {
    throw error;
  }
};
