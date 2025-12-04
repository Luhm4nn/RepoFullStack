import {
  getOne as getOneDB,
  getAll as getAllDB,
  createOne as createOneDB,
  deleteOne as deleteOneDB,
  updateOne as updateOneDB,
} from './salas.repository.js';

export const getAll = async () => {
  const salas = await getAllDB();
  return salas;
};

export const getOne = async (id) => {
  const sala = await getOneDB(id);
  return sala;
};

export const createOne = async (data) => {
  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: validar capacidad mínima/máxima, nombre único, etc.

  const newSala = await createOneDB(data);
  return newSala;
};

export const deleteOne = async (id) => {
  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: verificar que no tenga funciones programadas antes de eliminar

  const deletedSala = await deleteOneDB(id);
  return deletedSala;
};

export const updateOne = async (id, data) => {
  const salaExistente = await getOneDB(id);
  if (!salaExistente) {
    const error = new Error('Sala no encontrada.');
    error.status = 404;
    throw error;
  }

  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: validar cambios de capacidad vs funciones existentes, etc.

  const updatedSala = await updateOneDB(id, data);
  return updatedSala;
};
