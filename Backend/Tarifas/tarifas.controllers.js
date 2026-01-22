import * as service from './tarifas.service.js';

/**
 * Obtiene todas las tarifas
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const getTarifas = async (req, res) => {
  const tarifas = await service.getAll();
  if (!tarifas || tarifas.length === 0) {
    const error = new Error('No existen tarifas cargadas aún.');
    error.status = 404;
    throw error;
  }
  res.json(tarifas);
};

/**
 * Obtiene una tarifa por ID
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const getTarifa = async (req, res) => {
  const tarifa = await service.getOne(req.params.id);
  res.json(tarifa);
};

/**
 * Crea una nueva tarifa
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const createTarifa = async (req, res) => {
  const newTarifa = await service.create(req.body);
  res.status(201).json(newTarifa);
};

/**
 * Actualiza una tarifa existente
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const updateTarifa = async (req, res) => {
  const updatedTarifa = await service.update(req.params.id, req.body);
  if (!updatedTarifa) {
    return res.status(204).send();
  }
  res.status(200).json(updatedTarifa);
};

/**
 * Elimina una tarifa
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const deleteTarifa = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Tarifa eliminada correctamente.' });
};
