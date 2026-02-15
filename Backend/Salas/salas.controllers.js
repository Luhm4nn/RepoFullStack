import * as service from './salas.service.js';
import { createManyForSala, updateManyForSala } from './asientos.repository.js';

/**
 * Obtiene todas las salas registradas.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const getSalas = async (req, res) => {
  const salas = await service.getAll();
  res.json(salas);
};

/**
 * Obtiene una sala específica mediante su ID o nombre.
 * 
 * @param {Object} req - Objeto de solicitud con el parámetro coincidente.
 * @param {Object} res - Objeto de respuesta.
 */
export const getSala = async (req, res) => {
  const { param } = req.params;
  const sala = await service.getOne(param);
  res.json(sala);
};

/**
 * Crea una nueva sala y dispara la creación automática de sus asientos asociados.
 * 
 * @param {Object} req - Objeto de solicitud con datos de la sala y configuración de asientos.
 * @param {Object} res - Objeto de respuesta.
 */
export const createSala = async (req, res) => {
  const newSala = await service.create(req.body);
  await createManyForSala(
    newSala.idSala,
    req.body.filas,
    req.body.asientosPorFila,
    req.body.vipSeats || []
  );
  res.status(201).json(newSala);
};

/**
 * Elimina una sala por su ID.
 * 
 * @param {Object} req - Objeto de solicitud con `id` en params.
 * @param {Object} res - Objeto de respuesta.
 */
export const deleteSala = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Sala eliminada correctamente.' });
};

/**
 * Actualiza los datos de una sala y permite modificar la configuración de asientos VIP.
 * 
 * @param {Object} req - Objeto de solicitud con nuevos datos.
 * @param {Object} res - Objeto de respuesta.
 */
export const updateSala = async (req, res) => {
  const { vipSeats, ...salaData } = req.body;
  const updatedSala = await service.update(req.params.id, salaData);
  if (vipSeats !== undefined) {
    await updateManyForSala(req.params.id, vipSeats || []);
  }
  res.status(200).json(updatedSala);
};

/**
 * Obtiene el conteo total de salas en el sistema.
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export const getCountSalas = async (req, res) => {
  const count = await service.getCountAll();
  res.json({ count });
};

/**
 * Busca salas que coincidan con un criterio de búsqueda.
 * 
 * @param {Object} req - Objeto de solicitud con `q` y `limit` opcionales.
 * @param {Object} res - Objeto de respuesta.
 */
export const searchSalas = async (req, res) => {
  const { q, limit } = req.query;
  const salas = await service.search(q, limit);
  res.json(salas);
};

