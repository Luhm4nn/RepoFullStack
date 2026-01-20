import * as service from './salas.service.js';
import { createManyForSala, updateManyForSala } from './asientos.repository.js';
import { getCache, setCache, delCache } from '../utils/cache.js';

/**
 * Obtiene todas las salas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */

export const getSalas = async (req, res) => {
  const cacheKey = 'salas:all';
  const cached = await getCache(cacheKey);
  if (cached) {
    logger.info('Cache HIT', { cacheKey, endpoint: '/Salas', hit: true });
    return res.json(cached);
  }
  const salas = await service.getAll();
  await setCache(cacheKey, salas, 600); // TTL 10 min
  logger.info('Cache MISS', { cacheKey, endpoint: '/Salas', hit: false });
  res.json(salas);
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
  await delCache('salas:all');
  res.status(201).json(newSala);
};

/**
 * Elimina una sala
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteSala = async (req, res) => {
  await service.deleteOne(req.params.id);
  await delCache('salas:all');
  res.status(200).json({ message: 'Sala eliminada correctamente.' });
};

/**
 * Actualiza una sala y sus asientos VIP
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateSala = async (req, res) => {
  const { vipSeats, ...salaData } = req.body;
  const updatedSala = await service.update(req.params.id, salaData);
  if (vipSeats !== undefined) {
    await updateManyForSala(req.params.id, vipSeats || []);
  }
  await delCache('salas:all');
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
