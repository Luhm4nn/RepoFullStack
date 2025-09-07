import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./peliculas.service.js";

// Controllers for Peliculas

export const getPeliculas = async (req, res) => {
  const peliculas = await getAll();
  if (!peliculas || peliculas.length === 0) {
    console.log("No existen películas cargadas aún.");
  }
  res.json(peliculas);
};

export const getPelicula = async (req, res, next) => {
  const pelicula = await getOne(req.params.id);
  if (!pelicula) {
    const error = new Error("Película no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(pelicula);
};

export const createPelicula = async (req, res) => {
  const newPelicula = await createOne(req.body);
  res.status(201).json(newPelicula);
};

export const deletePelicula = async (req, res) => {
  const deletedPelicula = await deleteOne(req.params.id);
  res.status(200).json({ 
    message: "Película eliminada correctamente.",
    pelicula: deletedPelicula 
  });
};

export const updatePelicula = async (req, res) => {
  const updatedPelicula = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedPelicula);
};
