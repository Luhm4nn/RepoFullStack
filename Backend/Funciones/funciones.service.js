import * as repository from './funciones.repository.js';
import { getOne as getParametroRepository } from '../Parametros/parametros.repository.js';
import { getOne as getPeliculaRepository } from '../Peliculas/peliculas.repository.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';
import { ESTADOS_FUNCION } from '../constants/index.js';

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
 * Actualiza estados de funciones vencidas a INACTIVA
 * @private
 */
const autoFinalizarFuncionesVencidas = async () => {
  const now = new Date();
  await repository.autoInactivarVencidas(now);
};

/**
 * Obtiene funciones activas con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Items por página
 * @returns {Promise<Object>} Objeto con data y pagination
 */
export const getActiveFunciones = async (page = 1, limit = 10) => {
  await autoFinalizarFuncionesVencidas();
  return await repository.getActive(page, limit);
};

/**
 * Obtiene funciones inactivas con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Items por página
 * @returns {Promise<Object>} Objeto con data y pagination
 */
export const getInactiveFunciones = async (page = 1, limit = 10) => {
  await autoFinalizarFuncionesVencidas();
  return await repository.getInactive(page, limit);
};

/**
 * Obtiene funciones públicas
 * @returns {Promise<Array>} Lista de funciones públicas
 */
export const getPublicFunciones = async () => {
  await autoFinalizarFuncionesVencidas();
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

  // Verificar si tiene reservas activas antes de permitir borrar
  const activeReservasCount = await repository.countActiveReservations(params);
  if (activeReservasCount > 0) {
    const error = new Error(
      `No se puede eliminar la función porque tiene ${activeReservasCount} reserva(s) ACTIVA(S).`
    );
    error.status = 400;
    throw error;
  }

  if (funcion.estado !== ESTADOS_FUNCION.PRIVADA && funcion.estado !== ESTADOS_FUNCION.INACTIVA) {
    const error = new Error('Solo se pueden eliminar funciones privadas o inactivas.');
    error.status = 403;
    throw error;
  }

  return await repository.deleteOne(params);
};

/**
 * Obtiene funciones por ID de sala
 * @param {number} idSala - ID de la sala
 * @returns {Promise<Array>} Lista de funciones
 */
export const getFuncionesBySalaId = async (idSala) => {
  return await repository.getBySala(idSala);
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
export const updateOne = async (params, data) => {
  const funcionExistente = await repository.getOne(params);
  if (!funcionExistente) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }

  // Normalizar estado si viene del frontend
  if (data.estado) {
    data.estado = data.estado.toUpperCase();
  }

  // Validations for update
  if (data.estado) {
    if (
      ![ESTADOS_FUNCION.PRIVADA, ESTADOS_FUNCION.PUBLICA, ESTADOS_FUNCION.INACTIVA].includes(
        data.estado
      )
    ) {
      const error = new Error('Estado inválido. Solo se permiten: PRIVADA, PUBLICA, INACTIVA.');
      error.status = 400;
      throw error;
    }

    // No se puede privatizar si tiene reservas activas
    if (
      data.estado === ESTADOS_FUNCION.PRIVADA &&
      funcionExistente.estado !== ESTADOS_FUNCION.PRIVADA
    ) {
      const activeReservasCount = await repository.countActiveReservations(params);
      if (activeReservasCount > 0) {
        const error = new Error('Esta función cuenta con una reserva ACTIVA.');
        error.status = 400;
        throw error;
      }
    }
  } else if (funcionExistente.estado !== ESTADOS_FUNCION.PRIVADA) {
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
 * Obtiene funciones públicas por película y fecha (o semana)
 * @param {number} idPelicula - ID de la película
 * @param {string} fecha - Fecha o 'semana'
 * @returns {Promise<Array>} Lista de funciones públicas
 */
export const getFuncionesByPeliculaAndFechaService = async (idPelicula, fecha) => {
  let funciones;
  let hoy = new Date();
  if (fecha === 'semana') {
    const sieteDiasDespues = new Date();
    sieteDiasDespues.setDate(hoy.getDate() + 7);
    funciones = await repository.getByPeliculaAndRange(idPelicula, hoy, sieteDiasDespues);
  } else {
    funciones = await repository.getByPeliculaAndFecha(idPelicula, fecha);
  }
  // Filtrar solo funciones públicas y en fecha/hora futura

  const funcionesFiltradas = funciones.filter(
    (funcion) =>
      funcion.estado === ESTADOS_FUNCION.PUBLICA && new Date(funcion.fechaHoraFuncion) > hoy
  );
  return funcionesFiltradas;
};

/**
 * Obtiene detalles de una función con estadísticas
 * @param {Object} params - Parámetros de búsqueda
 * @returns {Promise<Object>} Función con estadísticas calculadas
 */
export const getDetallesFuncion = async (params) => {
  const funcionConStats = await repository.getOneWithStats(params);

  if (!funcionConStats) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }

  // Calcular total de asientos de la sala
  const totalAsientosSala =
    funcionConStats.sala?.filas && funcionConStats.sala?.asientosPorFila
      ? funcionConStats.sala.filas * funcionConStats.sala.asientosPorFila
      : 0;

  // Calcular porcentaje de ocupación
  const porcentajeOcupacion =
    totalAsientosSala > 0 ? (funcionConStats.asientosReservados / totalAsientosSala) * 100 : 0;

  return {
    ...funcionConStats,
    porcentajeOcupacion: parseFloat(porcentajeOcupacion),
    totalAsientosSala,
  };
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
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Items por página (default: 10)
 * @returns {Promise<Object>} Objeto con data y pagination
 */
export const getWithFilters = async (filters, page = 1, limit = 10) => {
  return await repository.getWithFilters(filters, page, limit);
};
