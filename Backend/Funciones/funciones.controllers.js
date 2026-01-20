import {
  import { delCache } from '../utils/cache.js';
  getOne,
  getAll,
  create,
  deleteOne,
  updateOne,
  getFuncionesByPeliculaAndFechaService,
  getActiveFunciones as getActiveFuncionesService,
  getInactiveFunciones as getInactiveFuncionesService,
  getPublicFunciones as getPublicFuncionesService,
  getCountPublic,
  getDetallesFuncion as getDetallesFuncionService,
  getWithFilters as getWithFiltersService,
} from "./funciones.service.js";


/**
 * Obtiene funciones de una película para la semana actual
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getFuncionesSemana = async (req, res) => {
  const { idPelicula } = req.params;
  const funciones = await getFuncionesByPeliculaAndFechaService(idPelicula, 'semana');
  res.json(funciones);
};

/**
 * Obtiene funciones filtradas por estado o con filtros avanzados
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @query {string} estado - Estado de la función (opcional)
 * @query {number} idPelicula - ID de película (opcional)
 * @query {string} nombrePelicula - Nombre de película (opcional)
 * @query {number} idSala - ID de sala (opcional)
 * @query {string} nombreSala - Nombre de sala (opcional)
 * @query {string} fechaDesde - Fecha desde (opcional)
 * @query {string} fechaHasta - Fecha hasta (opcional)
 * @query {number} page - Número de página (opcional, default: 1)
 * @query {number} limit - Límite de resultados por página (opcional, default: 10)
 */
export const getFunciones = async (req, res) => {
  const { estado, idPelicula, nombrePelicula, idSala, nombreSala, fechaDesde, fechaHasta, page = 1, limit = 10 } = req.query;

  // Si hay filtros avanzados (que no sean estado, page o limit), usar el nuevo servicio
  if (idPelicula || nombrePelicula || idSala || nombreSala || fechaDesde || fechaHasta) {
    const filters = { estado, idPelicula, nombrePelicula, idSala, nombreSala, fechaDesde, fechaHasta };
    const funciones = await getWithFiltersService(filters, parseInt(page), parseInt(limit));
    return res.json(funciones);
  }

  // Endpoints con paginación según estado
  let result;
  switch (estado?.toLowerCase()) {
    case 'activas':
      result = await getActiveFuncionesService(parseInt(page), parseInt(limit));
      break;
    case 'inactivas':
      result = await getInactiveFuncionesService(parseInt(page), parseInt(limit));
      break;
    case 'publicas':
      result = await getPublicFuncionesService();
      break;
    case 'todas':
      result = await getAll();
      break;
    default:
      result = await getActiveFuncionesService(parseInt(page), parseInt(limit));
      break;
  }

  res.json(result);
};

/**
 * Obtiene funciones por película y fecha
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getFuncionesByPeliculaAndFecha = async (req, res) => {
  const { idPelicula, fecha } = req.params;
  const funciones = await getFuncionesByPeliculaAndFechaService(idPelicula, fecha);
  res.json(funciones);
};

/**
 * Obtiene solo funciones activas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getActiveFuncionesEndpoint = async (req, res) => {
  const funciones = await getActiveFuncionesService();
  res.json(funciones);
};

/**
 * Obtiene solo funciones inactivas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getInactiveFuncionesEndpoint = async (req, res) => {
  const funciones = await getInactiveFuncionesService();
  res.json(funciones);
};

/**
 * Obtiene solo funciones públicas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
import { getCache, setCache } from '../utils/cache.js';

export const getPublicFuncionesEndpoint = async (req, res) => {
  const cacheKey = 'funciones:publicas';
  const cached = await getCache(cacheKey);
  if (cached) {
    logger.info('Cache HIT', { cacheKey, endpoint: '/Funciones/publicas', hit: true });
    return res.json(cached);
  }
  const funciones = await getPublicFuncionesService();
  await setCache(cacheKey, funciones, 300); // TTL 5 min
  logger.info('Cache MISS', { cacheKey, endpoint: '/Funciones/publicas', hit: false });
  res.json(funciones);
};

/**
 * Obtiene el conteo de funciones públicas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getCountPublicFunciones = async (req, res) => {
  const count = await getCountPublic();
  res.json({ count });
};

/**
 * Obtiene una función específica
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getFuncion = async (req, res) => {
  const funcion = await getOne(req.params);
  if (!funcion) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }
  res.json(funcion);
};

/**
 * Obtiene detalles de una función con estadísticas
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getDetallesFuncion = async (req, res) => {
  const detalles = await getDetallesFuncionService(req.params);
  res.json(detalles);
};


/**
 * Crea una nueva función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createFuncion = async (req, res) => {
    await delCache('funciones:publicas');
  const newFuncion = await create(req.body);

  if (newFuncion && (newFuncion.name === 'SOLAPAMIENTO_FUNCIONES' || newFuncion.name === 'FECHA_ESTRENO_INVALIDA')) {
    return res.status(newFuncion.status).json({
      message: newFuncion.message,
      errorCode: newFuncion.name,
    });
  }

  res.status(201).json(newFuncion);
};

/**
 * Elimina una función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteFuncion = async (req, res) => {
    await delCache('funciones:publicas');
  await deleteOne(req.params);
  res.status(200).json({ message: 'Función eliminada correctamente.' });
};

/**
 * Actualiza una función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateFuncion = async (req, res) => {
    await delCache('funciones:publicas');
  const funcion = await getOne(req.params);
  
  if (req.body.estado && (req.body.estado === 'Privada' || req.body.estado === 'Publica')) {
    const updatedFuncion = await updateOne(req.params, req.body);
    res.status(200).json(updatedFuncion);
  } 
    else if (funcion.estado === "Privada") {
    const updatedFuncion = await updateOne(req.params, req.body);
    res.status(200).json(updatedFuncion);
  } else {
    res.status(403).json({ message: "No se puede actualizar una función pública, excepto para cambiar su estado." });
  }
  const updatedFuncion = await updateOne(req.params, req.body);
  if (updatedFuncion) {
    if (updatedFuncion.name === "SOLAPAMIENTO_FUNCIONES") {
      return res.status(updatedFuncion.status).json({
        message: updatedFuncion.message,
        errorCode: updatedFuncion.name
      });
    } else if (updatedFuncion.name === "FECHA_ESTRENO_INVALIDA") {
      return res.status(updatedFuncion.status).json({
        message: updatedFuncion.message,
        errorCode: updatedFuncion.name
      });
    }
  }

  res.status(200).json(updatedFuncion);
};
