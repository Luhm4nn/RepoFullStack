import { getOne, getAll } from "../Repository/peliculas.repository.js";

// Controllers for Peliculas

export const getPeliculas = async (req, res) => {
    const peliculas = await getAll();
    res.json(peliculas);
}
export const getPelicula = async (req, res, next) => {
  
    const pelicula = await getOne(req.params.id);
    if (!pelicula) {
      const error = new Error("Película no encontrada");
      error.status = 404;
      throw error;
    }
    res.json(pelicula);
};

export const createPelicula = async (req, res) => {
  res.json("Lista de Peliculas");
};

export const deletePelicula = async (req, res) => {
  res.json("Lista de Peliculas");
};

export const updatePelicula = async (req, res) => {
 res.json("Lista de Peliculas");
};
