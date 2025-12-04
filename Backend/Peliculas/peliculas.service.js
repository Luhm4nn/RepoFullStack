import * as repository from './peliculas.repository.js';
import { getFuncionesByPeliculaId } from '../Funciones/funciones.service.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';
import { cloudinary } from '../config/cloudinary.js';

/**
 * Obtiene todas las películas
 * @returns {Promise<Array>} Lista de películas
 */
export const getAll = async () => {
  return await repository.getAll();
};

/**
 * Obtiene una película por ID
 * @param {number} id - ID de la película
 * @returns {Promise<Object>} Película encontrada
 * @throws {Error} Si la película no existe (404)
 */
export const getOne = async (id) => {
  const pelicula = await repository.getOne(id);
  return pelicula;
};

/**
 * Crea una nueva película
 * @param {Object} data - Datos de la película
 * @returns {Promise<Object>} Película creada
 */
export const create = async (data) => {
  const movieDataToCreate = {
    ...data,
    duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
  };

  return await repository.create(movieDataToCreate);
};

/**
 * Elimina una película
 * @param {number} id - ID de la película
 * @returns {Promise<Object>} Película eliminada
 */
export const deleteOne = async (id) => {
  const peliculaExistente = await repository.getOne(id);

  // Si tiene póster en Cloudinary se elimina también
  if (peliculaExistente?.portadaPublicId) {
    try {
      await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
      console.log('Póster eliminado de Cloudinary:', peliculaExistente.portadaPublicId);
    } catch (error) {
      console.error('Error eliminando póster de Cloudinary:', error);
    }
  }
  return await repository.deleteOne(id);
};

/**
 * Actualiza una película existente
 * @param {number} id - ID de la película
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Película actualizada
 * @throws {Error} Si la película no existe (404) o validación falla (400)
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

  // Si se subió un nuevo póster y existe uno anterior, eliminar el anterior
  if (data.portada && peliculaExistente.portadaPublicId) {
    try {
      await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
      console.log('Póster anterior eliminado de Cloudinary:', peliculaExistente.portadaPublicId);
    } catch (error) {
      console.error('Error eliminando póster anterior de Cloudinary:', error);
    }
  }

  const movieDataToUpdate = {
    ...data,
    duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
  };

  return await repository.update(id, movieDataToUpdate);
};

/**
 * Obtiene películas en cartelera
 * @returns {Promise<Array>} Lista de películas
 */
export const getAllEnCartelera = async () => {
  return await repository.getAllEnCartelera();
};

/**
 * Valida cambios en fecha de estreno
 * @param {Object} data - Datos de la película
 * @returns {Error|null} Error si la validación falla
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
