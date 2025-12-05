import * as service from './usuarios.service.js';

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Request
 * @param {Object} res - Response
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
 * Obtiene un usuario por DNI
 * @param {Object} req - Request
 * @param {Object} res - Response
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
 * Crea un nuevo usuario
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createUsuario = async (req, res) => {
  const newUsuario = await service.create(req.body);
  res.status(201).json(newUsuario);
};

/**
 * Elimina un usuario
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const deleteUsuario = async (req, res) => {
  await service.deleteOne(req.params.dni);
  res.status(200).json({ message: 'Usuario eliminado correctamente.' });
};

/**
 * Actualiza un usuario
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const updateUsuario = async (req, res) => {
  const updatedUsuario = await service.update(req.params.dni, req.body, req.user);
  res.status(200).json(updatedUsuario);
};
