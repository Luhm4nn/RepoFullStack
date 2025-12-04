import { getOne, getAll, createOne, deleteOne, updateOne } from './usuarios.service.js';

export const getUsuarios = async (req, res) => {
  const usuarios = await getAll();
  if (!usuarios || usuarios.length === 0) {
    const error = new Error('No existen usuarios cargados aún.');
    error.status = 404;
    throw error;
  }
  res.json(usuarios);
};

export const getUsuario = async (req, res, next) => {
  const usuario = await getOne(req.params.dni, req.user);
  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }
  res.json(usuario);
};

export const createUsuario = async (req, res) => {
  const newUsuario = await createOne(req.body);
  res.status(201).json(newUsuario);
};

export const deleteUsuario = async (req, res) => {
  await deleteOne(req.params.dni);
  res.status(200).json({ message: 'Usuario eliminado correctamente.' });
};

export const updateUsuario = async (req, res) => {
  const updatedUsuario = await updateOne(req.params.dni, req.body, req.user);
  res.status(200).json(updatedUsuario);
};
