import * as service from './tarifas.service.js';

/**
 * Recupera el listado completo de tarifas vigentes (Normal, VIP, Niños, etc).
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getTarifas = async (req, res) => {
  const tarifas = await service.getAll();
  if (!tarifas || tarifas.length === 0) {
    const error = new Error('No existen tarifas configuradas.');
    error.status = 404;
    throw error;
  }
  res.json(tarifas);
};

/**
 * Obtiene la información de una tarifa específica por su ID.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getTarifa = async (req, res) => {
  const tarifa = await service.getOne(req.params.id);
  res.json(tarifa);
};

/**
 * Crea una nueva tarifa en el sistema.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const createTarifa = async (req, res) => {
  const newTarifa = await service.create(req.body);
  res.status(201).json(newTarifa);
};

/**
 * Actualiza los valores de una tarifa (precio, descripción, vigencia).
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const updateTarifa = async (req, res) => {
  const updatedTarifa = await service.update(req.params.id, req.body);
  if (!updatedTarifa) {
    return res.status(204).send(); // Sin cambios
  }
  res.status(200).json(updatedTarifa);
};

/**
 * Elimina una tarifa del sistema.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const deleteTarifa = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Tarifa eliminada correctamente.' });
};
