import * as service from './usuarios.service.js';

/**
 * Controlador para obtener todos los usuarios.
 * Solo accesible por administradores (validado en rutas).
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 * @throws {Error} 404 si no hay usuarios registrados.
 */
export const getUsuarios = async (req, res) => {
  const usuarios = await service.getAll();
  if (!usuarios || usuarios.length === 0) {
    const error = new Error('No existen usuarios cargados aún.');
    error.status = 404;
    throw error;
  }
  res.json(usuarios);
};

/**
 * Controlador para obtener un usuario específico por su DNI.
 * Valida que el solicitante sea el dueño o un administrador.
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 * @throws {Error} 404 si el usuario no existe.
 */
export const getUsuario = async (req, res) => {
  const usuario = await service.getOne(req.params.dni, req.user);
  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }
  res.json(usuario);
};

/**
 * Controlador para crear/registrar un nuevo usuario.
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
export const createUsuario = async (req, res) => {
  const newUsuario = await service.create(req.body);
  res.status(201).json(newUsuario);
};

/**
 * Controlador para eliminar un usuario.
 * Solo accesible por administradores.
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
export const deleteUsuario = async (req, res) => {
  await service.deleteOne(req.params.dni);
  res.status(200).json({ message: 'Usuario eliminado correctamente.' });
};

/**
 * Controlador para actualizar los datos de un usuario.
 * Valida permisos de propiedad.
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
export const updateUsuario = async (req, res) => {
  const updatedUsuario = await service.update(req.params.dni, req.body, req.user);
  res.status(200).json(updatedUsuario);
};

/**
 * Controlador para que un usuario actualice su propio perfil.
 * Simplifica la interfaz para el frontend (no requiere DNI en la URL).
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
export const updateSelf = async (req, res) => {
  const updatedUsuario = await service.update(req.user.id, req.body, req.user);
  res.status(200).json(updatedUsuario);
};

/**
 * Controlador específico para cambiar la contraseña del usuario autenticado.
 * Requiere la contraseña actual por seguridad.
 * 
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await service.changePassword(req.user.id, currentPassword, newPassword);
  res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
};
