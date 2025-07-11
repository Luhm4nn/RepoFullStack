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
  if (!newPelicula) {
    const error = new Error("Error al crear la película.");
    error.status = 400;
    throw error;
  }
  res.status(201).json(newPelicula);
};

export const deletePelicula = async (req, res, next) => {
  try {
    const deletedPelicula = await deleteOne(req.params.id);
    if (!deletedPelicula) {
      const error = new Error("Pelicula no encontrada para eliminar.");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ deletedPelicula }); // Enviar respuesta de éxito
  } catch (error) {
    if (error.code === "P2025") {
      // Código de error de Prisma para "Registro no encontrado"
      const notFoundError = new Error("Sala no encontrada para eliminar.");
      notFoundError.status = 404;
      throw notFoundError; // Lanzar error personalizado si no se encuentra el registro
    }
    throw error; // Lanzar error si ocurre otro tipo de error
  }
};

export const updatePelicula = async (req, res) => {
  const updatedPelicula = await updateOne(req.params.id, req.body);
  if (!updatedPelicula) {
    const error = new Error("Película no encontrada para actualizar.");
    error.status = 404;
    throw error;
  }
  res.status(200).json(updatedPelicula);
};
