import {
  getOne,
  getAll,
  createMany,
  deleteOne,
  update,
  getByFuncion,
} from './asientoreservas.service.js';

/**
 * Obtiene todos los asientos reservados
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getAsientoReservas = async (req, res) => {
  const asientoreservas = await getAll();
  res.json(asientoreservas);
};

/**
 * Obtiene un asiento reservado específico
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getAsientoReserva = async (req, res) => {
  const asientoreserva = await getOne(req.params);
  res.json(asientoreserva);
};

/**
 * Obtiene asientos reservados por función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getAsientosReservadosByFuncion = async (req, res) => {
  const { idSala, fechaHoraFuncion } = req.params;
  const reservados = await getByFuncion(idSala, fechaHoraFuncion);
  res.json(reservados);
};

/**
 * Crea múltiples reservas de asientos
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createAsientoReserva = async (req, res) => {
  const newAsientoReservas = await createMany(req.body);
  res.status(201).json(newAsientoReservas);
};

/**
 * Elimina una reserva de asiento
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteAsientoReserva = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: 'Reserva de asiento eliminada correctamente.' });
};

/**
 * Actualiza una reserva de asiento
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateAsientoReserva = async (req, res) => {
  const updatedAsientoReserva = await update(req.params, req.body);
  res.status(200).json(updatedAsientoReserva);
};
