import * as service from './peliculas.service.js';

/**
 * Obtiene todas las películas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getPeliculas = async (req, res) => {
  const peliculas = await service.getAll();
  if (!peliculas || peliculas.length === 0) {
    // console.log('No existen películas cargadas aún.'); // Removed unnecessary log
  }
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
  if (updatedPelicula) {
    if (updatedPelicula.name === 'FECHA_ESTRENO') {
      return res.status(updatedPelicula.status).json({
        message: updatedPelicula.message,
        errorCode: updatedPelicula.name,
      });
    }
    res.status(200).json(updatedPelicula);
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
    console.error('Error fetching peliculas en cartelera:', error);
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
    console.error('Error counting peliculas en cartelera:', error);
    res.status(500).json({ message: 'Error counting peliculas en cartelera.' });
  }
};
