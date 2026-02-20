import * as repository from './peliculas.repository.js';
import { getFuncionesByPeliculaId } from '../Funciones/funciones.service.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../utils/logger.js';

/**
 * Recupera todas las películas registradas.
 * @returns {Promise<Array>} Lista completa de películas.
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene películas con paginación simple.
 * @param {number} page - Número de página.
 * @param {number} limit - Cantidad de registros por página.
 * @returns {Promise<Object>} Datos paginados.
 */
export const getPaginated = async (page = 1, limit = 10) => {
  return await repository.getPaginated(page, limit);
};

/**
 * Obtiene películas filtradas por búsqueda de texto y género con paginación.
 * @param {Object} filters - Objeto con filtros (busqueda, genero).
 * @param {number} page - Número de página.
 * @param {number} limit - Límite por página.
 * @returns {Promise<Object>} Resultados filtrados y paginados.
 */
export const getWithFilters = async (filters, page = 1, limit = 10) => {
  return await repository.getWithFilters(filters, page, limit);
};

/**
 * Obtiene el detalle de una película por su ID.
 * @param {number|string} id - Identificador de la película.
 * @returns {Promise<Object>} Datos de la película.
 */
export const getOne = async (id) => {
  return await repository.getOne(id);
};

/**
 * Lógica para la creación de una película, asegurando tipos correctos.
 * @param {Object} data - Datos de la película.
 * @returns {Promise<Object>} Película creada.
 */
export const create = async (data) => {
  const movieDataToCreate = {
    ...data,
    duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
  };

  return await repository.create(movieDataToCreate);
};

/**
 * Lógica para eliminar una película y su póster asociado en Cloudinary.
 * @param {number|string} id - ID de la película a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteOne = async (id) => {
  const peliculaExistente = await repository.getOne(id);
  if (!peliculaExistente) {
    const error = new Error('Película no encontrada.');
    error.status = 404;
    throw error;
  }

  // No permitir eliminar películas que tengan funciones
  const funciones = await getFuncionesByPeliculaId(id);
  if (funciones.length > 0) {
    const error = new Error(
      `No se puede eliminar la película porque tiene ${funciones.length} funciones creadas.`
    );
    error.status = 400;
    throw error;
  }

  if (peliculaExistente?.portadaPublicId) {
    try {
      await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
    } catch (error) {
      logger.error('Error eliminando póster de Cloudinary:', error);
    }
  }
  return await repository.deleteOne(id);
};

/**
 * Actualiza los datos de una película, validando restricciones de fechas y gestionando el póster.
 * @param {number|string} id - ID de la película.
 * @param {Object} data - Nuevos datos.
 * @returns {Promise<Object>} Película actualizada o error de validación.
 */
export const update = async (id, data) => {
  const peliculaExistente = await repository.getOne(id);
  if (!peliculaExistente) {
    const error = new Error('Película no encontrada.');
    error.status = 404;
    throw error;
  }

  const errorValidations = await validationsEstreno({ id, ...data });
  if (errorValidations) {
    return errorValidations;
  }

  if (data.portada && peliculaExistente.portadaPublicId) {
    try {
      await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
    } catch (error) {
      logger.error('Error eliminando póster anterior de Cloudinary:', error);
    }
  }

  const movieDataToUpdate = {
    ...data,
    duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
  };

  return await repository.update(id, movieDataToUpdate);
};

/**
 * Obtiene películas que tienen funciones públicas programadas en la semana.
 * @returns {Promise<Array>} Lista de películas en cartelera.
 */
export const getAllEnCartelera = async () => {
  const inicio = new Date();
  const fin = new Date();
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  return await repository.getAllEnCartelera(inicio, fin);
};

/**
 * Cuenta cuántas películas están actualmente en cartelera.
 * @returns {Promise<number>} Conteo de películas.
 */
export const getCountEnCartelera = async () => {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  return await repository.countEnCartelera(inicio, fin);
};

/**
 * Busca películas mediante una cadena de texto.
 * @param {string} searchQuery - Texto a buscar.
 * @param {number} limit - Límite opcional de resultados.
 * @returns {Promise<Array>} Películas encontradas.
 */
export const search = async (searchQuery, limit) => {
  return await repository.search(searchQuery, limit);
};

/**
 * Obtiene las películas cuya fecha de estreno es futura.
 * @returns {Promise<Array>} Lista de estrenos.
 */
export const getEstrenos = async () => {
  return await repository.getEstrenos();
};

/**
 * Valida que la nueva fecha de estreno no sea posterior a funciones ya programadas.
 * @param {Object} data - Datos de la película (id y fechaEstreno).
 * @returns {Error|null} Error de validación o null si es correcto.
 */
async function validationsEstreno(data) {
  const fechaNueva = new Date(data.fechaEstreno);
  const funciones = await getFuncionesByPeliculaId(data.id);

  if (funciones && funciones.length > 0) {
    for (const funcion of funciones) {
      if (new Date(funcion.fechaHoraFuncion) < fechaNueva) {
        const fechaEstrenoFormateada = formatDateForBackendMessage(fechaNueva);
        const error = new Error(
          `No se puede cambiar la fecha de estreno al ${fechaEstrenoFormateada} porque ya hay funciones programadas anteriormente.`
        );
        error.status = 400;
        error.name = 'FECHA_ESTRENO';
        return error;
      }
    }
  }
  return null;
}
