import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  cancellOne,
  getLatestReservas as getLatestReservasRepo
} from "./reservas.repository.js";

// Controllers for Reservas

export const getReservas = async (req, res) => {
  const reservas = await getAll();
  if (!reservas || reservas.length === 0) {
    const error = new Error("No existen reservas cargadas aún.");
    error.status = 404;
    throw error;
  }
  res.json(reservas);
};

export const getReserva = async (req, res) => {
  const reserva = await getOne(req.params);
  if (!reserva) {
    const error = new Error("Reserva no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(reserva);
};

export const createReserva = async (req, res) => {
  const newReserva = await createOne(req.body);
  res.status(201).json(newReserva);
};

export const deleteReserva = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: "Reserva eliminada correctamente." });
};

export const cancellReserva = async (req, res) => {
  const cancelledReserva = await cancellOne(req.params);
  res.status(200).json(cancelledReserva);
};

export const getLatestReservas = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reservas = await getLatestReservasRepo(limit);
  res.json(reservas);
};