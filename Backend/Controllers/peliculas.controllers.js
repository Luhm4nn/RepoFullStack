import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "../Repository/peliculas.repository.js";

// Controllers for Peliculas

export const getPeliculas = async (req, res) => {
  const peliculas = await getAll();
  if (!peliculas || peliculas.length === 0) {
    const error = new Error("No existen películas cargadas aún.");
    error.status = 404;
    throw error;
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

export const deletePelicula = async (req, res, next) => {
  const deletedPelicula = await deleteOne(req.params.id);
  res.status(200).json({ message: "Pelicula eliminada correctamente." }); // Enviar respuesta de éxito
};

export const updatePelicula = async (req, res) => {
  const updatedPelicula = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedPelicula);
};
