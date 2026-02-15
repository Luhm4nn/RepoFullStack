import * as service from './asientos.service.js';

/**
 * Obtiene todos los asientos pertenecientes a una sala específica.
 * 
 * @param {Object} req - Objeto de solicitud con `idSala` en params.
 * @param {Object} res - Objeto de respuesta.
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
 * Obtiene el detalle de un asiento específico.
 * 
 * @param {Object} req - Objeto de solicitud con parámetros de identificación del asiento.
 * @param {Object} res - Objeto de respuesta.
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
 * Crea un asiento individual en una sala.
 * 
 * @param {Object} req - Objeto de solicitud con `idSala` y datos del asiento.
 * @param {Object} res - Objeto de respuesta.
 */
export const createAsiento = async (req, res) => {
  const newAsiento = await service.create(req.params.idSala, req.body);
  res.status(201).json(newAsiento);
};

/**
 * Elimina un asiento del sistema.
 * 
 * @param {Object} req - Objeto de solicitud con parámetros de identificación.
 * @param {Object} res - Objeto de respuesta.
 */
export const deleteAsiento = async (req, res) => {
  await service.deleteOne(req.params);
  res.status(200).json({ message: 'Asiento eliminado correctamente.' });
};

/**
 * Actualiza la información de un asiento (ej. cambiarlo a VIP).
 * 
 * @param {Object} req - Objeto de solicitud con parámetros de identificación y nuevos datos.
 * @param {Object} res - Objeto de respuesta.
 */
export const updateAsiento = async (req, res) => {
  const updatedAsiento = await service.update(req.params, req.body);
  res.status(200).json(updatedAsiento);
};
