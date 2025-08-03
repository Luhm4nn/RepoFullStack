import axios from "axios";

const API_URL = "http://localhost:4000/Salas";

export const getSalas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
}

/*export const createPelicula = async (pelicula) => {
  try {
    const response = await axios.post(API_URL, pelicula);
    return response.data;
  } catch (error) {
    console.error("Error creating pelicula:", error);
    throw error;
  }
}*/