import {
  getOne as getOneDB,
  getAll as getAllDB,
  createOne as createOneDB,
  deleteOne as deleteOneDB,
  updateOne as updateOneDB,
} from './usuarios.repository.js';
import bcrypt from 'bcryptjs';

function validateOwnership(user, targetDNI) {
  if (user.rol === 'ADMIN') {
    return;
  }

  if (user.id !== parseInt(targetDNI)) {
    const error = new Error('No puedes acceder a recursos de otros usuarios');
    error.status = 403;
    throw error;
  }
}

export const getAll = async () => {
  const usuarios = await getAllDB();
  return usuarios;
};

export const getOne = async (dni, user) => {
  validateOwnership(user, dni);
  const usuario = await getOneDB(dni);
  return usuario;
};

export const createOne = async (data) => {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);
  const usuarioData = { ...data, contrasena: hashedPassword };
  const newUsuario = await createOneDB(usuarioData);
  return newUsuario;
};

export const deleteOne = async (id) => {
  const deletedUsuario = await deleteOneDB(id);
  return deletedUsuario;
};

export const updateOne = async (dni, data, user) => {
  validateOwnership(user, dni);

  const usuarioExistente = await getOneDB(dni);
  if (!usuarioExistente) {
    const error = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  const updatedUsuario = await updateOneDB(dni, data);
  return updatedUsuario;
};
