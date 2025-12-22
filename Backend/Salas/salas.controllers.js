import * as service from './salas.service.js';
import { createManyForSala, updateManyForSala } from './asientos.repository.js';

/**
 * Obtiene todas las salas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getSalas = async (req, res) => {
  const salas = await service.getAll();
  res.json(salas);
};

/**
 * Obtiene una sala por ID o Nombre
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getSala = async (req, res) => {
  const { param } = req.params;
  const sala = await service.getOne(param);
  res.json(sala);
};

/**
 * Crea una nueva sala y sus asientos
 * @param {Object} req - Request
 * @param {Object} res - Response
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
 * Elimina una sala
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteSala = async (req, res) => {
  await service.deleteOne(req.params.id);
  res.status(200).json({ message: 'Sala eliminada correctamente.' });
};

/**
 * Actualiza una sala y sus asientos VIP
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateSala = async (req, res) => {
  // Extraer vipSeats del body antes de actualizar la sala
  const { vipSeats, ...salaData } = req.body;

  // Actualizar solo los datos de la sala (sin vipSeats)
  const updatedSala = await service.update(req.params.id, salaData);

  // Actualizar asientos VIP si se proporcionaron
  if (vipSeats !== undefined) {
    await updateManyForSala(req.params.id, vipSeats || []);
  }

  res.status(200).json(updatedSala);
};

/**
 * Obtiene el conteo de salas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getCountSalas = async (req, res) => {
  const count = await service.getCountAll();
  res.json({ count });
};

/**
 * Busca salas por nombre con query params
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @query {string} q - Término de búsqueda
 * @query {number} limit - Límite de resultados (opcional)
 */
export const searchSalas = async (req, res) => {
  const { q, limit } = req.query;
  const salas = await service.search(q, limit);
  res.json(salas);
};
