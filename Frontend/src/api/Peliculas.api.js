import api from './axiosInstance.js';

export const getPeliculas = async () => {
  try {
    const response = await api.get('/Peliculas');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getPelicula = async (id) => {
  try {
    const response = await api.get(`/Pelicula/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const searchPeliculas = async (query, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get('/Peliculas');
    const peliculas = response.data;

    return peliculas
      .filter((pelicula) =>
        pelicula.nombrePelicula?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
  } catch (error) {
    throw error;
  }
};


export const createPelicula = async (pelicula) => {
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const response = await api.post('/Pelicula', pelicula, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updatePelicula = async (id, pelicula) => {
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const response = await api.put(`/Pelicula/${id}`, pelicula, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deletePelicula = async (id) => {
  try {
    const response = await api.delete(`/Pelicula/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getPeliculasEnCartelera = async () => {
  try {
    const response = await api.get('/Peliculas/cartelera');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCountPeliculasEnCartelera = async () => {
  try {
    const response = await api.get('/Peliculas/cartelera/count');
    return response.data.count;
  } catch (error) {
    throw error;
  }
};