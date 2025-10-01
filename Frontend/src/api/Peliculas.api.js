import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getPeliculas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Peliculas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching peliculas:", error);
    throw error;
  }
};

export const getPelicula = async (id) =>{
  try {
    const response = await axios.get(`${VITE_API_URL}/Pelicula/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pelicula:", error);
    throw error;
  }
}

export const searchPeliculas = async (query, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    // Por ahora usamos la API existente y filtramos en frontend
    // TODO: Implementar endpoint /Peliculas/search en backend
    const response = await axios.get(`${VITE_API_URL}/Peliculas`);
    const peliculas = response.data;

    // Filtrado client-side (temporal hasta que tengamos /search en backend)
    const filteredPeliculas = peliculas
      .filter(pelicula => 
        pelicula.nombrePelicula && 
        pelicula.nombrePelicula.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);

    return filteredPeliculas;
  } catch (error) {
    console.error("Error searching peliculas:", error);
    throw error;
  }
};

export const createPelicula = async (pelicula) => {
  try {
    // Configurar headers para FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await axios.post(`${VITE_API_URL}/Pelicula`, pelicula, config);
    return response.data;
  } catch (error) {
    console.error("Error creating pelicula:", error);
    if (error.response) {
        console.error("Backend error response:", error.response.data);
    }
    throw error;
  }
};

export const updatePelicula = async (id, pelicula) => {
  try {
    // Configurar headers para FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await axios.put(`${VITE_API_URL}/Pelicula/${id}`, pelicula, config);
    return response.data;
  } catch (error) {
    console.error("Error updating pelicula:", error);
    throw error;
  }
}

export const deletePelicula = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Pelicula/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pelicula:", error);
    throw error;
  }
}

export const getPeliculasEnCartelera = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Peliculas/cartelera`);
    return response.data;
  } catch (error) {
    console.error("Error fetching peliculas en cartelera:", error);
    throw error;
  }
}