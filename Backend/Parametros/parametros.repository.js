import prisma from '../prisma/prisma.js';

/**
 * Consulta todos los registros de la tabla Parametro.
 * @returns {Promise<Array>}
 */
async function getAll() {
  return await prisma.parametro.findMany();
}

/**
 * Busca un parámetro específico por su clave primaria.
 * @param {number|string} id - ID del parámetro.
 * @returns {Promise<Object|null>}
 */
async function getOne(id) {
  return await prisma.parametro.findUnique({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
}

/**
 * Inserta un nuevo registro de configuración.
 * @param {Object} data - Datos a insertar.
 * @returns {Promise<Object>}
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
 * Elimina un parámetro por ID.
 * @param {number|string} id - ID del parámetro.
 * @returns {Promise<Object>}
 */
async function deleteOne(id) {
  return await prisma.parametro.delete({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
}

/**
 * Actualiza los campos de un parámetro.
 * @param {number|string} id - ID del parámetro.
 * @param {Object} data - Datos actualizados.
 * @returns {Promise<Object>}
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
