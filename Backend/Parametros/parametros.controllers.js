import * as service from './parametros.service.js';

/**
 * Obtiene todos los parámetros
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const getParametros = async (req, res) => {
  const parametros = await service.getAll();
  if (!parametros || parametros.length === 0) {
    const error = new Error('No existen parámetros cargados aún.');
    error.status = 404;
    throw error;
  }
  res.json(parametros);
};

/**
 * Obtiene un parámetro por ID
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del parámetro
 * @param {Object} res - Response de Express
 */
export const getParametro = async (req, res) => {
  const parametro = await service.getOne(req.params.id);
  res.json(parametro);
};

/**
 * Crea un nuevo parámetro
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Datos del parámetro
 * @param {Object} res - Response de Express
 */
export const createParametro = async (req, res) => {
  const newParametro = await service.create(req.body);
  res.status(201).json(newParametro);
};

/**
 * Actualiza un parámetro existente
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del parámetro
 * @param {Object} req.body - Datos a actualizar
 * @param {Object} res - Response de Express
 */
export const updateParametro = async (req, res) => {
  const updatedParametro = await service.update(req.params.id, req.body);
  res.status(200).json(updatedParametro);
};

/**
 * Elimina un parámetro
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del parámetro
 * @param {Object} res - Response de Express
 */
export const deleteParametro = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Parámetro eliminado correctamente.' });
};

/**
 * Obtiene el tiempo límite de reserva
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const getTiempoLimiteReserva = async (req, res) => {
  const tiempoLimite = await service.getTiempoLimiteReserva();
  res.json({ tiempoLimiteReserva: tiempoLimite });
}