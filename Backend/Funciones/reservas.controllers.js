import {
  getReserva as getReservaService,
  getAllReservas as getAllReservasService,
  createReserva as createReservaService,
  deleteReserva as deleteReservaService,
  cancelReserva as cancelReservaService,
  getLatestReservas as getLatestReservasService,
  getUserReservas as getUserReservasService
} from "./reservas.service.js";

/**
 * Obtiene todas las reservas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getReservas = async (req, res) => {
  const reservas = await getAllReservasService();
  res.json(reservas);
};

/**
 * Obtiene una reserva específica
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getReserva = async (req, res) => {
  const reserva = await getReservaService(req.params, req.user);
  res.json(reserva);
};

/**
 * Crea una nueva reserva
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createReserva = async (req, res) => {
  const newReserva = await createReservaService(req.body, req.user);
  res.status(201).json(newReserva);
};

/**
 * Cancela una reserva
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const cancellReserva = async (req, res) => {
  const cancelledReserva = await cancelReservaService(req.params, req.user);
  res.status(200).json(cancelledReserva);
};

/**
 * Obtiene las últimas reservas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getLatestReservas = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reservas = await getLatestReservasService(limit);
  res.json(reservas);
};

/**
 * Obtiene las reservas del usuario autenticado
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @query {string} estado - Filtra reservas por estado (CONFIRMADA, CANCELADA, opcional)
 */
export const getUserReservas = async (req, res) => {
  const userDNI = req.user.id; // El DNI está en req.user.id
  const { estado } = req.query;
  const reservas = await getUserReservasService(userDNI, estado);
  res.json(reservas);
};



/**
 * Elimina una reserva
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteReserva = async (req, res) => {
  const deletedReserva = await deleteReservaService(req.params);
  res.status(200).json(deletedReserva);
};
