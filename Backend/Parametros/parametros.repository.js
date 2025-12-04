import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los parámetros del sistema
 * @returns {Promise<Array>} Lista de parámetros
 */
async function getAll() {
  return await prisma.parametro.findMany();
}

/**
 * Obtiene un parámetro por su ID
 * @param {number} id - ID del parámetro
 * @returns {Promise<Object|null>} Parámetro encontrado o null
 */
async function getOne(id) {
  return await prisma.parametro.findUnique({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
}

/**
 * Crea un nuevo parámetro
 * @param {Object} data - Datos del parámetro
 * @param {string} data.descripcionParametro - Descripción del parámetro
 * @param {string} data.valor - Valor del parámetro
 * @returns {Promise<Object>} Parámetro creado
 */
async function create(data) {
  return await prisma.parametro.create({
    data: {
      descripcionParametro: data.descripcionParametro,
      valor: data.valor,
    },
  });
}

/**
 * Elimina un parámetro por su ID
 * @param {number} id - ID del parámetro
 * @returns {Promise<Object>} Parámetro eliminado
 */
async function deleteOne(id) {
  return await prisma.parametro.delete({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
}

/**
 * Actualiza un parámetro existente
 * @param {number} id - ID del parámetro
 * @param {Object} data - Datos a actualizar
 * @param {string} [data.descripcionParametro] - Nueva descripción
 * @param {string} [data.valor] - Nuevo valor
 * @returns {Promise<Object>} Parámetro actualizado
 */
async function update(id, data) {
  return await prisma.parametro.update({
    where: {
      idParametro: parseInt(id, 10),
    },
    data: {
      descripcionParametro: data.descripcionParametro,
      valor: data.valor,
    },
  });
}

export { getAll, getOne, create, update, deleteOne };
