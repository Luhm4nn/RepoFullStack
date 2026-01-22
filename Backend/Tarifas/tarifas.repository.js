import prisma from '../prisma/prisma.js';

/**
 * Obtiene todas las tarifas
 * @returns {Promise<Array>} Lista de tarifas
 */
async function getAll() {
  return await prisma.tarifa.findMany();
}

/**
 * Obtiene una tarifa por su ID
 * @param {number} id - ID de la tarifa
 * @returns {Promise<Object|null>} Tarifa encontrada o null
 */
async function getOne(id) {
  return await prisma.tarifa.findUnique({
    where: {
      idTarifa: parseInt(id, 10),
    },
  });
}

/**
 * Crea una nueva tarifa
 * @param {Object} data - Datos de la tarifa
 * @param {string} data.nombreTarifa - Nombre de la tarifa
 * @param {number} data.precio - Precio de la tarifa
 * @param {number} [data.edadMinima] - Edad mínima
 * @param {number} [data.edadMaxima] - Edad máxima
 * @returns {Promise<Object>} Tarifa creada
 */
async function create(data) {
  return await prisma.tarifa.create({
    data: {
      nombreTarifa: data.nombreTarifa,
      precio: data.precio,
      edadMinima: data.edadMinima,
      edadMaxima: data.edadMaxima,
    },
  });
}

/**
 * Actualiza una tarifa existente
 * @param {number} id - ID de la tarifa
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Tarifa actualizada
 */
async function update(id, data) {
  return await prisma.tarifa.update({
    where: {
      idTarifa: parseInt(id, 10),
    },
    data: {
      precio: data.precio,
      fechaDesde: data.fechaDesde,
      descripcionTarifa: data.descripcionTarifa,
    },
  });
}

/**
 * Elimina una tarifa por su ID
 * @param {number} id - ID de la tarifa
 * @returns {Promise<Object>} Tarifa eliminada
 */
async function deleteOne(id) {
  return await prisma.tarifa.delete({
    where: {
      idTarifa: parseInt(id, 10),
    },
  });
}

export { getAll, getOne, create, update, deleteOne };
