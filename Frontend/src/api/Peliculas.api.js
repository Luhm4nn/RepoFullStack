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

export const updatePelicula = async (id, pelicula) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, pelicula);
    return response.data;
  } catch (error) {
    console.error("Error updating pelicula:", error);
    throw error;
  }
}

export const deletePelicula = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pelicula:", error);
    throw error;
  }
}