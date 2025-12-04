import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  cancellOne,
  getLatestReservas as getLatestReservasRepo
} from "./reservas.repository.js";

// Controllers para Reservas
// El controller es solo un orquestador: recibe request, llama service, retorna response

export const getReservas = async (req, res) => {
  const reservas = await getAllReservas();
  res.json(reservas);
};

export const getReserva = async (req, res) => {
  const reserva = await getReservaService(req.params, req.user);
  res.json(reserva);
};

export const createReserva = async (req, res) => {
  const newReserva = await createReservaService(req.body, req.user);
  res.status(201).json(newReserva);
};

export const cancellReserva = async (req, res) => {
  const cancelledReserva = await cancelReservaService(req.params, req.user);
  res.status(200).json(cancelledReserva);
};

export const getLatestReservas = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reservas = await getLatestReservasRepo(limit);
  res.json(reservas);
};
