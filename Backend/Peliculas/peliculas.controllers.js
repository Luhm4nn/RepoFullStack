import * as service from './peliculas.service.js';
import logger from '../utils/logger.js';

/**
 * Obtiene todas las películas con soporte para paginación y filtros
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @query {number} page - Número de página (opcional, default: 1)
 * @query {number} limit - Límite de resultados por página (opcional, default: 10)
 * @query {string} busqueda - Búsqueda por nombre de película o director (opcional)
 * @query {string} genero - Filtro por género (opcional)
 */
export const getPeliculas = async (req, res) => {
  const { page = 1, limit = 10, busqueda, genero } = req.query;

  // Si hay filtros, usar el servicio con filtros
  if (busqueda || genero) {
    const filters = { busqueda, genero };
    const result = await service.getWithFilters(filters, parseInt(page), parseInt(limit));
    return res.json(result);
  }

  // Si se solicita paginación (page o limit presentes), usar servicio paginado
  if (req.query.page || req.query.limit) {
    const result = await service.getPaginated(parseInt(page), parseInt(limit));
    return res.json(result);
  }

  // Sin parámetros, devolver todas (backward compatibility)
  const peliculas = await service.getAll();
  res.json(peliculas);
};

/**
 * Obtiene una película por ID
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getPelicula = async (req, res) => {
  const pelicula = await service.getOne(req.params.id);
  if (!pelicula) {
    const error = new Error('Película no encontrada.');
    error.status = 404;
    throw error;
  }
  res.json(pelicula);
};

/**
 * Crea una nueva película
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createPelicula = async (req, res) => {
  const newPelicula = await service.create(req.body);
  res.status(201).json(newPelicula);
};

/**
 * Elimina una película
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deletePelicula = async (req, res) => {
  const deletedPelicula = await service.deleteOne(req.params.id);
  res.status(200).json({
    message: 'Película eliminada correctamente.',
    pelicula: deletedPelicula,
  });
};

/**
 * Actualiza una película
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updatePelicula = async (req, res) => {
  const updatedPelicula = await service.update(req.params.id, req.body);
  await delCache('peliculas:cartelera');
  if (updatedPelicula) {
    if (updatedPelicula.name === 'FECHA_ESTRENO') {
      return res.status(updatedPelicula.status).json({
        message: updatedPelicula.message,
        errorCode: updatedPelicula.name,
      });
    }
    return res.status(200).json(updatedPelicula);
  }
};

/**
 * Obtiene películas en cartelera
 * @param {Object} req - Request
 * @param {Object} res - Response
 */

export const getPeliculasEnCartelera = async (req, res) => {
  try {
    const peliculas = await service.getAllEnCartelera();
    res.json(peliculas);
  } catch (error) {
    logger.error('Error fetching peliculas en cartelera:', error);
    res.status(500).json({ message: 'Error fetching peliculas en cartelera.' });
  }
};

/**
 * Obtiene el conteo de películas en cartelera
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getCountPeliculasEnCartelera = async (req, res) => {
  try {
    const count = await service.getCountEnCartelera();
    res.json({ count });
  } catch (error) {
    logger.error('Error counting peliculas en cartelera:', error);
    res.status(500).json({ message: 'Error counting peliculas en cartelera.' });
  }
};

/**
 * Busca películas por nombre con query params
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @query {string} q - Término de búsqueda
 * @query {number} limit - Límite de resultados (opcional)
 */
export const searchPeliculas = async (req, res) => {
  const { q, limit } = req.query;
  const peliculas = await service.search(q, limit);
  res.json(peliculas);
};

/**
 * Obtiene películas próximas a estrenarse
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getEstrenos = async (req, res) => {
  const peliculas = await service.getEstrenos();
  res.json(peliculas);
};
