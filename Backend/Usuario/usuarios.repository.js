import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
async function getAll() {
  return await prisma.usuario.findMany({
    include: {
      _count: {
        select: { reserva: true },
      },
    },
  });
}

/**
 * Obtiene un usuario por DNI
 * @param {number} dni - DNI del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
async function getOne(dni) {
  return await prisma.usuario.findUnique({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
}

/**
 * Crea un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
async function create(data) {
  return await prisma.usuario.create({
    data: {
      DNI: parseInt(data.DNI, 10),
      nombreUsuario: data.nombreUsuario,
      apellidoUsuario: data.apellidoUsuario,
      email: data.email,
      contrasena: data.contrasena,
      rol: data.rol,
      telefono: data.telefono,
    },
  });
}

/**
 * Elimina un usuario por DNI
 * @param {number} dni - DNI del usuario
 * @returns {Promise<Object>} Usuario eliminado
 */
async function deleteOne(dni) {
  return await prisma.usuario.delete({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
}

/**
 * Actualiza un usuario existente
 * @param {number} dni - DNI del usuario
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
async function update(dni, data) {
  return await prisma.usuario.update({
    where: {
      DNI: parseInt(dni, 10),
    },
    data: {
      DNI: data.DNI,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      contrasena: data.contrasena,
      rol: data.rol,
      telefono: data.telefono,
    },
  });
}

export { getOne, getAll, create, deleteOne, update };
