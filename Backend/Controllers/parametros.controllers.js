import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "../Repository/parametros.repository.js";

// Controllers for Parametros

export const getParametros = async (req, res) => {
  const parametros = await getAll();
  if (!parametros || parametros.length === 0) {
    const error = new Error("No existen parametros cargados aún.");
    error.status = 404;
    throw error;
  }
  res.json(parametros);
};

export const getParametro = async (req, res, next) => {
  const parametro = await getOne(req.params.id);
  if (!parametro) {
    const error = new Error("Parametro no encontrado.");
    error.status = 404;
    throw error;
  }
  res.json(parametro);
};

export const createParametro = async (req, res) => {
  const newParametro = await createOne(req.body);
  if (!newParametro) {
    const error = new Error("Error al crear el parametro.");
    error.status = 400;
    throw error;
  }
  res.status(201).json(newParametro);
};

export const deleteParametro = async (req, res) => {
  try {
    await deleteOne(req.params.id);
    res.status(200).json({ message: "Parametro eliminado correctamente" }); // Enviar respuesta de éxito
  } catch (error) {
    if (error.code === "P2025") {
      // Código de error de Prisma para "Registro no encontrado"
      const notFoundError = new Error("Parametro no encontrado para eliminar.");
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error; // Lanzar error si ocurre otro tipo de error
  }
};

export const updateParametro = async (req, res) => {
  const updatedParametro = await updateOne(req.params.id, req.body);
  if (!updatedParametro) {
    const error = new Error("Parametro no encontrado para actualizar.");
    error.status = 404;
    throw error;
  }
  res.status(200).json(updatedParametro);
};
