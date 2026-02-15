import * as service from './peliculas.service.js';

/**
 * Obtiene todas las películas con soporte para paginación y filtros.
 * Sanea los parámetros `page` y `limit` para evitar errores de tipo.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const getPeliculas = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { busqueda, genero } = req.query;

  if (busqueda || genero) {
    const filters = { 
      busqueda, 
      genero: genero?.toUpperCase() 
    };
    const result = await service.getWithFilters(filters, page, limit);
    return res.json(result);
  }

  if (req.query.page || req.query.limit) {
    const result = await service.getPaginated(page, limit);
    return res.json(result);
  }

  const peliculas = await service.getAll();
  res.json(peliculas);
};

/**
 * Obtiene una película específica por su ID.
 * 
 * @param {Object} req - Objeto de solicitud con `id` en params.
 * @param {Object} res - Objeto de respuesta.
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
 * Crea una nueva película y normaliza campos como género y MPAA.
 * 
 * @param {Object} req - Objeto de solicitud con datos de la película en el body.
 * @param {Object} res - Objeto de respuesta.
 */
export const createPelicula = async (req, res) => {
  if (req.body.generoPelicula) {
    req.body.generoPelicula = req.body.generoPelicula.toUpperCase();
  }
  if (req.body.MPAA) {
    req.body.MPAA = req.body.MPAA.toUpperCase();
  }
  
  const newPelicula = await service.create(req.body);
  res.status(201).json(newPelicula);
};

/**
 * Elimina una película por su ID.
 * 
 * @param {Object} req - Objeto de solicitud con `id` en params.
 * @param {Object} res - Objeto de respuesta.
 */
export const deletePelicula = async (req, res) => {
  const deletedPelicula = await service.deleteOne(req.params.id);
  res.status(200).json({
    message: 'Película eliminada correctamente.',
    pelicula: deletedPelicula,
  });
};

/**
 * Actualiza los datos de una película existente.
 * 
 * @param {Object} req - Objeto de solicitud con datos a actualizar en body e ID en params.
 * @param {Object} res - Objeto de respuesta.
 */
export const updatePelicula = async (req, res) => {
  if (req.body.generoPelicula) {
    req.body.generoPelicula = req.body.generoPelicula.toUpperCase();
  }
  if (req.body.MPAA) {
    req.body.MPAA = req.body.MPAA.toUpperCase();
  }

  const updatedPelicula = await service.update(req.params.id, req.body);
  if (updatedPelicula && updatedPelicula.name === 'FECHA_ESTRENO') {
    return res.status(updatedPelicula.status).json({
      message: updatedPelicula.message,
      errorCode: updatedPelicula.name,
    });
  }
  return res.status(200).json(updatedPelicula);
};

/**
 * Obtiene todas las películas en cartelera.
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export const getPeliculasEnCartelera = async (req, res) => {
  const peliculas = await service.getAllEnCartelera();
  res.json(peliculas);
};

/**
 * Obtiene la cantidad total de películas en cartelera.
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export const getCountPeliculasEnCartelera = async (req, res) => {
  const count = await service.getCountEnCartelera();
  res.json({ count });
};

/**
 * Busca películas por nombre o criterios específicos mediante query params.
 * 
 * @param {Object} req - Objeto de solicitud con `q` en la query string.
 * @param {Object} res - Objeto de respuesta.
 */
export const searchPeliculas = async (req, res) => {
  const { q, limit } = req.query;
  const peliculas = await service.search(q, limit);
  res.json(peliculas);
};

/**
 * Obtiene los próximos estrenos.
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export const getEstrenos = async (req, res) => {
  const peliculas = await service.getEstrenos();
  res.json(peliculas);
};

