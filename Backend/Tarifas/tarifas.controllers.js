import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./tarifas.service.js";

// Controllers for Tarifas

export const getTarifas = async (req, res) => {
  const tarifas = await getAll();
  if (!tarifas || tarifas.length === 0) {
    const error = new Error("No existen tarifas cargadas aún.");
    error.status = 404;
    throw error;
  }
  res.json(tarifas);
};

export const getTarifa = async (req, res) => {
  const tarifa = await getOne(req.params.id);
  res.json(tarifa);
};

export const createTarifa = async (req, res) => {
  const newTarifa = await createOne(req.body);
  if (!newTarifa) {
    const error = new Error("Error al crear la tarifa.");
    error.status = 400;
    throw error;
  }
  res.status(201).json(newTarifa);
};

export const deleteTarifa = async (req, res) => {
  const deletedTarifa = await deleteOne(req.params.id);
  res.status(200).json({ message: "Tarifa eliminada correctamente." });
};

export const updateTarifa = async (req, res) => {
  const updatedTarifa = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedTarifa);
};
