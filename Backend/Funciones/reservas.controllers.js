import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  cancellOne,
  getLatestReservas,
} from "./reservas.repository.js";

// Controllers para Reservas

export const getReservas = async (req, res) => {
  const reservas = await getAll();
  res.json(reservas);
};

export const getReserva = async (req, res) => {
  const reserva = await getOne(req.params, req.user);
  res.json(reserva);
};

export const createReserva = async (req, res) => {
  const newReserva = await createOne(req.body, req.user);
  res.status(201).json(newReserva);
};

export const cancellReserva = async (req, res) => {
  const cancelledReserva = await cancellOne(req.params, req.user);
  res.status(200).json(cancelledReserva);
};

export const getLatestReservas = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reservas = await getLatestReservas(limit);
  res.json(reservas);
};

export const deleteReserva = async (req, res) => {
  const deletedReserva = await deleteOne(req.params, req.user);
  res.status(200).json(deletedReserva);
};
