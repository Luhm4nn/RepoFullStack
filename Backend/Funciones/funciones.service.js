import * as repository from './funciones.repository.js';
import { getOne as getParametroRepository } from '../Parametros/parametros.repository.js';
import { getOne as getPeliculaRepository } from '../Peliculas/peliculas.repository.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';

/**
 * Obtiene todas las funciones
 * @returns {Promise<Array>} Lista de funciones
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene una función específica
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Función encontrada
 */
export const getOne = async (params) => {
  return await repository.getOne(params);
};

/**
 * Obtiene funciones activas
 * @returns {Promise<Array>} Lista de funciones activas
 */
export const getActiveFunciones = async () => {
  return await repository.getActive();
};

/**
 * Obtiene funciones inactivas
 * @returns {Promise<Array>} Lista de funciones inactivas
 */
export const getInactiveFunciones = async () => {
  return await repository.getInactive();
};

/**
 * Obtiene funciones públicas
 * @returns {Promise<Array>} Lista de funciones públicas
 */
export const getPublicFunciones = async () => {
  return await repository.getPublic();
};

/**
 * Cuenta funciones públicas
 * @returns {Promise<number>} Cantidad de funciones públicas
 */
export const getCountPublic = async () => {
  return await repository.countPublic();
};

/**
 * Crea una nueva función con validaciones
 * @param {Object} data - Datos de la función
 * @returns {Promise<Object|Error>} Función creada o Error
 */
export const create = async (data) => {
  const solapamiento = await verificarSolapamientos(data);
  const estrenoProblem = await verificarFechaDeEstreno(data);

  if (solapamiento) return solapamiento;
  if (estrenoProblem) return estrenoProblem;

  return await repository.create(data);
};

/**
 * Elimina una función
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Función eliminada
 * @throws {Error} Si no existe o no se puede eliminar
 */
export const deleteOne = async (params) => {
  const funcion = await repository.getOne(params);
  if (!funcion) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }

  if (funcion.estado !== 'Privada' && funcion.estado !== 'Inactiva') {
    const error = new Error('Solo se pueden eliminar funciones privadas o inactivas.');
    error.status = 403;
    throw error;
  }

  return await repository.deleteOne(params);
};

/**
 * Obtiene funciones por ID de película
 * @param {number} idPelicula - ID de la película
 * @returns {Promise<Array>} Lista de funciones
 */
export const getFuncionesByPeliculaId = async (idPelicula) => {
  return await repository.getByPelicula(idPelicula);
};

/**
 * Actualiza una función con validaciones
 * @param {Object} params - Parámetros de búsqueda
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object|Error>} Función actualizada o Error
 * @throws {Error} Si no existe o validación falla
 */
export const update = async (params, data) => {
  const funcionExistente = await repository.getOne(params);
  if (!funcionExistente) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }

  // Validations for update
  if (data.estado) {
    if (!['Privada', 'Publica', 'Inactiva'].includes(data.estado)) {
      const error = new Error('Estado inválido. Solo se permiten: Privada, Publica, Inactiva.');
      error.status = 400;
      throw error;
    }
  } else if (funcionExistente.estado !== 'Privada') {
    const error = new Error(
      'No se puede actualizar una función pública o inactiva, excepto para cambiar su estado.'
    );
    error.status = 403;
    throw error;
  }

  // Check for overlaps if critical fields change
  if (data.fechaHoraFuncion || data.idSala || data.idPelicula) {
    const datosParaValidar = {
      idSala: data.idSala || funcionExistente.idSala,
      fechaHoraFuncion: data.fechaHoraFuncion || funcionExistente.fechaHoraFuncion,
      idPelicula: data.idPelicula || funcionExistente.idPelicula,
    };
    const solapamiento = await verificarSolapamientos(datosParaValidar, funcionExistente);
    const estrenoProblem = await verificarFechaDeEstreno(datosParaValidar, funcionExistente);

    if (solapamiento) return solapamiento;
    if (estrenoProblem) return estrenoProblem;
  }

  return await repository.update(params, data);
};

/**
 * Obtiene funciones por película y fecha (o semana)
 * @param {number} idPelicula - ID de la película
 * @param {string} fecha - Fecha o 'semana'
 * @returns {Promise<Array>} Lista de funciones
 */
export const getFuncionesByPeliculaAndFechaService = async (idPelicula, fecha) => {
  if (fecha === 'semana') {
    const hoy = new Date();
    const sieteDiasDespues = new Date();
    sieteDiasDespues.setDate(hoy.getDate() + 7);
    return await repository.getByPeliculaAndRange(idPelicula, hoy, sieteDiasDespues);
  }
  return await repository.getByPeliculaAndFecha(idPelicula, fecha);
};

// Validation functions

const verificarFechaDeEstreno = async (nuevaFuncion, funcionExistente = null) => {
  const pelicula = await getPeliculaRepository(nuevaFuncion.idPelicula);
  if (!pelicula) {
    const error = new Error('Película no encontrada.');
    error.status = 404;
    throw error;
  }

  const fechaEstreno = new Date(pelicula.fechaEstreno);
  const fechaFinNueva = new Date(nuevaFuncion.fechaHoraFuncion);
  fechaFinNueva.setMinutes(fechaFinNueva.getMinutes() + parseInt(pelicula.duracion, 10));

  if (fechaFinNueva < fechaEstreno) {
    const fechaEstrenoFormateada = formatDateForBackendMessage(fechaEstreno);
    const error = new Error(
      `La película "${pelicula.nombrePelicula}" se estrena el ${fechaEstrenoFormateada}. La función no puede programarse antes del estreno de la película.`
    );
    error.status = 400;
    error.name = 'FECHA_ESTRENO_INVALIDA';
    return error;
  }

  return null;
};

const verificarSolapamientos = async (nuevaFuncion, funcionExistente = null) => {
  const parametroLimpieza = await getParametroRepository(1);
  if (!parametroLimpieza) {
    const error = new Error('Parámetro de tiempo de limpieza no encontrado.');
    error.status = 404;
    throw error;
  }

  const tiempoLimpieza = parseInt(parametroLimpieza.valor, 10);
  const nuevaPelicula = await getPeliculaRepository(nuevaFuncion.idPelicula);
  if (!nuevaPelicula) {
    const error = new Error('Película no encontrada.');
    error.status = 404;
    throw error;
  }

  const duracionNuevaPelicula = parseInt(nuevaPelicula.duracion, 10);
  const funcionesMismaSala = await repository.getBySala(nuevaFuncion.idSala);

  const funcionesFiltradas = funcionesMismaSala.filter(
    (f) =>
      !(
        funcionExistente &&
        f.idSala === funcionExistente.idSala &&
        f.fechaHoraFuncion.getTime() === new Date(funcionExistente.fechaHoraFuncion).getTime()
      )
  );

  const nuevaFechaInicio = new Date(nuevaFuncion.fechaHoraFuncion);
  const nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracionNuevaPelicula * 60000);

  for (const funcionExistenteSala of funcionesFiltradas) {
    const fechaExistenteInicio = new Date(funcionExistenteSala.fechaHoraFuncion);

    const peliculaExistente = await getPeliculaRepository(funcionExistenteSala.idPelicula);
    const duracionExistente = parseInt(peliculaExistente.duracion, 10);
    const fechaExistenteFin = new Date(fechaExistenteInicio.getTime() + duracionExistente * 60000);

    const finExistenteMasLimpieza = new Date(fechaExistenteFin.getTime() + tiempoLimpieza * 60000);
    const finNuevaMasLimpieza = new Date(nuevaFechaFin.getTime() + tiempoLimpieza * 60000);

    const haySolapamiento =
      (nuevaFechaInicio < finExistenteMasLimpieza && nuevaFechaFin > fechaExistenteInicio) ||
      (fechaExistenteInicio < finNuevaMasLimpieza && fechaExistenteFin > nuevaFechaInicio);

    if (haySolapamiento) {
      const error = new Error(
        `La función se solapa con otra función existente. Se requieren ${tiempoLimpieza} minutos de tiempo de limpieza entre funciones.`
      );
      error.status = 409;
      error.name = 'SOLAPAMIENTO_FUNCIONES';
      return error;
    }
  }

  return null;
};

/**
 * Obtiene funciones con filtros dinámicos
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista de funciones filtradas
 */
export const getWithFilters = async (filters) => {
  return await repository.getWithFilters(filters);
};
