import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./asientos.service.js";

// Controllers for Asientos

export const getAsientos = async (req, res) => {
  const asientos = await getAll(req.params.idSala);
  if (!asientos || asientos.length === 0) {
    const error = new Error("No existen asientos cargados para esa sala.");
    error.status = 404;
    throw error;
  }
  res.json(asientos);
};

export const getAsiento = async (req, res, next) => {
  const asiento = await getOne(req.params);
  if (!asiento) {
    const error = new Error("Asiento no encontrado.");
    error.status = 404;
    throw error;
  }
  res.json(asiento);
};

export const createAsiento = async (req, res) => {
  const newAsiento = await createOne(req.params.idSala, req.body);
  res.status(201).json(newAsiento);
};

export const deleteAsiento = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: "Asiento eliminado correctamente." });
};

export const updateAsiento = async (req, res) => {
  const updatedAsiento = await updateOne(req.params, req.body);
  res.status(200).json(updatedAsiento);
};
