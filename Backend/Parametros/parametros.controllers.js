import * as service from './parametros.service.js';

/**
 * Recupera el listado completo de parámetros de configuración global.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getParametros = async (req, res) => {
  const parametros = await service.getAll();
  if (!parametros || parametros.length === 0) {
    const error = new Error('No existen parámetros configurados.');
    error.status = 404;
    throw error;
  }
  res.json(parametros);
};

/**
 * Obtiene la información detallada de un parámetro específico.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getParametro = async (req, res) => {
  const parametro = await service.getOne(req.params.id);
  res.json(parametro);
};

/**
 * Registra un nuevo parámetro de configuración en el sistema.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const createParametro = async (req, res) => {
  const newParametro = await service.create(req.body);
  res.status(201).json(newParametro);
};

/**
 * Actualiza los valores de un parámetro existente.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const updateParametro = async (req, res) => {
  const updatedParametro = await service.update(req.params.id, req.body);
  res.status(200).json(updatedParametro);
};

/**
 * Elimina de forma permanente un parámetro del sistema.
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const deleteParametro = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Parámetro eliminado correctamente.' });
};

/**
 * Endpoint de utilidad para obtener el valor de tiempo límite de reserva (ID fijo 2).
 * @param {Object} req - Request de Express.
 * @param {Object} res - Response de Express.
 */
export const getTiempoLimiteReserva = async (req, res) => {
  const tiempoLimite = await service.getTiempoLimiteReserva();
  res.json({ tiempoLimiteReserva: tiempoLimite });
};