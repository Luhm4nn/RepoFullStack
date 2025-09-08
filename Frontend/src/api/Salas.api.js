import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getSalas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Salas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
}

// ✨ NUEVA: Búsqueda de salas con debounce
export const searchSalas = async (query, limit = 5) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    // Por ahora usamos la API existente y filtramos en frontend
    // TODO: Implementar endpoint /Salas/search en backend
    const response = await axios.get(`${VITE_API_URL}/Salas`);
    const salas = response.data;
    
    // Filtrado client-side (temporal hasta que tengamos /search en backend)
    const filteredSalas = salas
      .filter(sala => 
        sala.nombreSala && 
        sala.nombreSala.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
      
    return filteredSalas;
  } catch (error) {
    console.error("Error searching salas:", error);
    throw error;
  }
};

export const getSala = async (id) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Sala/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sala:", error);
    throw error;
  }
};

export const checkSalaExists = async (nombreSala) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/Sala/check/${nombreSala}`);
    return response.data.exists;
  } catch (error) {
    console.error("Error checking sala:", error);
    return false;
  }
};

export const createSala = async (sala) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/Sala`, sala);
    return response.data;
  } catch (error) {
    console.error("Error creating sala:", error);
    throw error;
  }
}

export const updateSala = async (id, sala) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/Sala/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error("Error updating sala:", error);
    throw error;
  }
}

export const deleteSala = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/Sala/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sala:", error);
    throw error;
  }
}

export const getAsientosBySala = async (id) => {
  try {
    const idSala = parseInt(id, 10);
    const response = await axios.get(`${VITE_API_URL}/Sala/${idSala}/Asientos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los asientos de la sala:", error);
    throw error;
  }
};
