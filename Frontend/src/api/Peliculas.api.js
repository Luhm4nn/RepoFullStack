import axios from "axios";

const API_URL = "http://localhost:4000/Pelicula";

export const getPeliculas = async () => {
  try {
    const response = await axios.get("http://localhost:4000/Peliculas");
    return response.data;
  } catch (error) {
    console.error("Error fetching peliculas:", error);
    throw error;
  }
};

export const createPelicula = async (pelicula) => {
  try {
    const response = await axios.post(API_URL, pelicula);
    return response.data;
  } catch (error) {
    console.error("Error creating pelicula:", error);
    throw error;
  }
};
