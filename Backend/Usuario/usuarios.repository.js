import prisma from '../prisma/prisma.js';

/**
 * Obtiene todos los usuarios registrados en el sistema,
 * incluyendo el conteo de sus reservas.
 * 
 * @returns {Promise<Array<Object>>} Lista de objetos de usuario.
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
 * Busca un usuario por su DNI.
 * 
 * @param {number|string} dni - El DNI del usuario a buscar.
 * @returns {Promise<Object|null>} El objeto del usuario si se encuentra, de lo contrario null.
 */
async function getOne(dni) {
  return await prisma.usuario.findUnique({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
}

/**
 * Registra un nuevo usuario en la base de datos.
 * 
 * @param {Object} data - Datos del usuario.
 * @param {number|string} data.DNI - DNI del usuario.
 * @param {string} data.nombreUsuario - Nombre del usuario.
 * @param {string} data.apellidoUsuario - Apellido del usuario.
 * @param {string} data.email - Correo electrónico único.
 * @param {string} data.contrasena - Contraseña (ya hasheada).
 * @param {string} data.rol - Rol del usuario (ADMIN, CLIENTE, etc).
 * @param {string} [data.telefono] - Teléfono opcional.
 * @returns {Promise<Object>} El usuario creado.
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
 * Elimina un usuario de la base de datos por su DNI.
 * 
 * @param {number|string} dni - DNI del usuario a eliminar.
 * @returns {Promise<Object>} El usuario eliminado.
 */
async function deleteOne(dni) {
  return await prisma.usuario.delete({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
}

/**
 * Actualiza la información de un usuario existente.
 * 
 * @param {number|string} dni - DNI del usuario a actualizar.
 * @param {Object} data - Objeto con los nuevos datos del usuario.
 * @returns {Promise<Object>} El usuario actualizado.
 */
async function update(dni, data) {
  return await prisma.usuario.update({
    where: {
      DNI: parseInt(dni, 10),
    },
    data: {
      nombreUsuario: data.nombreUsuario,
      apellidoUsuario: data.apellidoUsuario,
      email: data.email,
      contrasena: data.contrasena,
      rol: data.rol,
      telefono: data.telefono,
    },
  });
}

export { getOne, getAll, create, deleteOne, update };
