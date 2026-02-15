// import { delCache } from '../utils/cache.js';
import {
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
import { ESTADOS_FUNCION } from '../constants/index.js';


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
  let {
    estado,
    idPelicula,
    nombrePelicula,
    idSala,
    nombreSala,
    fechaDesde,
    fechaHasta,
    page = 1,
    limit = 10,
  } = req.query;

  // Sanitizar page y limit (evita NaN si se pasan strings inválidos o [object Object])
  let parsedPage = parseInt(page, 10);
  let parsedLimit = parseInt(limit, 10);

  if (isNaN(parsedPage) || parsedPage < 1) parsedPage = 1;
  if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 10;

  // Si hay filtros avanzados (que no sean estado, page o limit), usar el nuevo servicio
  if (idPelicula || nombrePelicula || idSala || nombreSala || fechaDesde || fechaHasta) {
    const filters = {
      estado,
      idPelicula,
      nombrePelicula,
      idSala,
      nombreSala,
      fechaDesde,
      fechaHasta,
    };
    const funciones = await getWithFiltersService(filters, parsedPage, parsedLimit);
    return res.json(funciones);
  }

  // Endpoints con paginación según estado
  let result;
  const statusKey = estado?.toUpperCase();

  switch (statusKey) {
    case 'PRIVADA':
    case 'PRIVADAS':
    case 'ACTIVA':
    case 'ACTIVAS':
      result = await getActiveFuncionesService(parsedPage, parsedLimit);
      break;
    case 'INACTIVA':
    case 'INACTIVAS':
      result = await getInactiveFuncionesService(parsedPage, parsedLimit);
      break;
    case 'PUBLICA':
    case 'PUBLICAS':
      result = await getPublicFuncionesService();
      break;
    case 'TODAS':
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

export const getPublicFuncionesEndpoint = async (req, res) => {
  const funciones = await getPublicFuncionesService();
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
  // Normalizar estado a mayúsculas si viene en el body
  if (req.body.estado) {
    req.body.estado = req.body.estado.toUpperCase();
  }
  
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
  await deleteOne(req.params);
  res.status(200).json({ message: 'Función eliminada correctamente.' });
};

/**
 * Actualiza una función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateFuncion = async (req, res) => {
  const funcion = await getOne(req.params);

  // Normalizar estado a mayúsculas si viene en el body
  if (req.body.estado) {
    req.body.estado = req.body.estado.toUpperCase();
  }
  
  if (req.body.estado && (req.body.estado === ESTADOS_FUNCION.PRIVADA || req.body.estado === ESTADOS_FUNCION.PUBLICA)) {
    const updatedFuncion = await updateOne(req.params, req.body);
    return res.status(200).json(updatedFuncion);
  } 
  
  if (funcion.estado === ESTADOS_FUNCION.PRIVADA) {
    const updatedFuncion = await updateOne(req.params, req.body);
    return res.status(200).json(updatedFuncion);
  } else {
    return res.status(403).json({ message: "No se puede actualizar una función pública, excepto para cambiar su estado." });
  }
};
