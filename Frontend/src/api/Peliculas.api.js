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

// ✨ NUEVA: Búsqueda de películas con debounce
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

export const getPelicula = async (id) =>{
  try {
    const response = await axios.get(`${VITE_API_URL}/Pelicula/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pelicula:", error);
    throw error;
  }
}

export const createPelicula = async (pelicula) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Pelicula`, pelicula);
    return response.data;
  } catch (error) {
    console.error("Error creating pelicula:", error);
    throw error;
  }
};

export const updatePelicula = async (id, pelicula) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/Pelicula/${id}`, pelicula);
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