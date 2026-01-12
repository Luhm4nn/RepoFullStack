import {
  getOne,
  getAll,
  create,
  deleteOne,
  update,
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
 * @query {number} limit - Límite de resultados (opcional)
 */
export const getFunciones = async (req, res) => {
  const { estado, idPelicula, nombrePelicula, idSala, nombreSala, fechaDesde, fechaHasta, limit } = req.query;

  // Si hay filtros avanzados, usar el nuevo servicio
  if (idPelicula || nombrePelicula || idSala || nombreSala || fechaDesde || fechaHasta || limit) {
    const filters = { estado, idPelicula, nombrePelicula, idSala, nombreSala, fechaDesde, fechaHasta, limit };
    const funciones = await getWithFiltersService(filters);
    return res.json(funciones);
  }

  // Comportamiento legacy para mantener compatibilidad
  let funciones;
  switch (estado?.toLowerCase()) {
    case 'activas':
      funciones = await getActiveFuncionesService();
      break;
    case 'inactivas':
      funciones = await getInactiveFuncionesService();
      break;
    case 'publicas':
      funciones = await getPublicFuncionesService();
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
