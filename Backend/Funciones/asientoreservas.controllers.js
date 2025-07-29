import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./asientoreservas.repository.js";

// Controllers for AsientoReservas

export const getAsientoReservas = async (req, res) => {
  const asientoreservas = await getAll();
  if (!asientoreservas || asientoreservas.length === 0) {
    const error = new Error("No existen asientos reservados cargados aún.");
    error.status = 404;
    throw error;
  }
  res.json(asientoreservas);
};

export const getAsientoReserva = async (req, res, next) => {
  const asientoreserva = await getOne(req.params);
  if (!asientoreserva) {
    const error = new Error("Reserva de asiento no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(asientoreserva);
};

export const createAsientoReserva = async (req, res) => {
  const newAsientoReserva = await createOne(req.body);
  res.status(201).json(newAsientoReserva);
};

export const deleteAsientoReserva = async (req, res) => {
  await deleteOne(req.params);
  res
    .status(200)
    .json({ message: "Reserva de asiento eliminada correctamente." }); // Enviar respuesta de éxito
};

export const updateAsientoReserva = async (req, res) => {
  const updatedAsientoReserva = await updateOne(req.params, req.body);
  res.status(200).json(updatedAsientoReserva);
};
