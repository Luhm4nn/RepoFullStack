import {
  getOne,
  getAll,
  create,
  deleteOne,
  update,
  getFuncionesByPeliculaAndFechaService,
  getActiveFunciones as getActiveFuncionesService,
  getInactiveFunciones as getInactiveFuncionesService,
  getPublicFunciones as getPublicFuncionesService
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
 * Obtiene funciones filtradas por estado
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getFunciones = async (req, res) => {
  const { estado } = req.query;
  let funciones;

  switch (estado?.toLowerCase()) {
    case 'activas':
      funciones = await getActiveFuncionesService();
      break;
    case 'inactivas':
      funciones = await getInactiveFuncionesService();
      break;
    case 'todas':
      funciones = await getAll();
      break;
    default:
      funciones = await getActiveFuncionesService();
      break;
  }

  res.json(funciones);
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
}

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
 * Crea una nueva función
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createFuncion = async (req, res) => {
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
  const updatedFuncion = await update(req.params, req.body);
  
  if (updatedFuncion && (updatedFuncion.name === 'SOLAPAMIENTO_FUNCIONES' || updatedFuncion.name === 'FECHA_ESTRENO_INVALIDA')) {
    return res.status(updatedFuncion.status).json({
      message: updatedFuncion.message,
      errorCode: updatedFuncion.name,
    });
  }

  res.status(200).json(updatedFuncion);
};
