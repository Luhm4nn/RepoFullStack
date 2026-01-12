import * as service from './asientos.service.js';

/**
 * Obtiene todos los asientos de una sala
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getAsientos = async (req, res) => {
  const asientos = await service.getAll(req.params.idSala);
  if (!asientos || asientos.length === 0) {
    const error = new Error('No existen asientos cargados para esa sala.');
    error.status = 404;
    throw error;
  }
  res.json(asientos);
};

/**
 * Obtiene un asiento específico
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getAsiento = async (req, res) => {
  const asiento = await service.getOne(req.params);
  if (!asiento) {
    const error = new Error('Asiento no encontrado.');
    error.status = 404;
    throw error;
  }
  res.json(asiento);
};

/**
 * Crea un asiento individual
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createAsiento = async (req, res) => {
  const newAsiento = await service.create(req.params.idSala, req.body);
  res.status(201).json(newAsiento);
};

/**
 * Elimina un asiento
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteAsiento = async (req, res) => {
  await service.deleteOne(req.params);
  res.status(200).json({ message: 'Asiento eliminado correctamente.' });
};

/**
 * Actualiza un asiento
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateAsiento = async (req, res) => {
  const updatedAsiento = await service.update(req.params, req.body);
  res.status(200).json(updatedAsiento);
};
