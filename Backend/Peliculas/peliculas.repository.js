import prisma from '../prisma/prisma.js';

/**
 * Obtiene todas las películas
 * @returns {Promise<Array>} Lista de películas
 */
async function getAll() {
  return await prisma.pelicula.findMany();
}

/**
 * Obtiene una película por ID
 * @param {number} id - ID de la película
 * @returns {Promise<Object|null>} Película encontrada o null
 */
async function getOne(id) {
  return await prisma.pelicula.findUnique({
    where: {
      idPelicula: parseInt(id, 10),
    },
  });
}

/**
 * Crea una nueva película
 * @param {Object} data - Datos de la película
 * @returns {Promise<Object>} Película creada
 */
async function create(data) {
  return await prisma.pelicula.create({
    data: {
      nombrePelicula: data.nombrePelicula,
      duracion: data.duracion,
      generoPelicula: data.generoPelicula,
      director: data.director,
      fechaEstreno: data.fechaEstreno,
      sinopsis: data.sinopsis,
      trailerURL: data.trailerURL,
      portada: data.portada,
      portadaPublicId: data.portadaPublicId,
      MPAA: data.MPAA,
    },
  });
}

/**
 * Elimina una película por ID
 * @param {number} id - ID de la película
 * @returns {Promise<Object>} Película eliminada
 */
async function deleteOne(id) {
  return await prisma.pelicula.delete({
    where: {
      idPelicula: parseInt(id, 10),
    },
  });
}

/**
 * Actualiza una película existente
 * @param {number} id - ID de la película
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Película actualizada
 */
async function update(id, data) {
  return await prisma.pelicula.update({
    where: {
      idPelicula: parseInt(id, 10),
    },
    data: {
      nombrePelicula: data.nombrePelicula,
      duracion: data.duracion,
      generoPelicula: data.generoPelicula,
      director: data.director,
      fechaEstreno: data.fechaEstreno,
      sinopsis: data.sinopsis,
      trailerURL: data.trailerURL,
      portada: data.portada,
      portadaPublicId: data.portadaPublicId,
      MPAA: data.MPAA,
    },
  });
}

/**
 * Obtiene películas que tienen funciones públicas (en cartelera)
 * @returns {Promise<Array>} Lista de películas en cartelera
 */
async function getAllEnCartelera() {
  return await prisma.pelicula.findMany({
    where: {
      funcion: {
        some: {
          estado: 'Publica',
        },
      },
    },
  });
}

export { getOne, getAll, create, deleteOne, update, getAllEnCartelera };
