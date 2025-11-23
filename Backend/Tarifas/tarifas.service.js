import {
  getOne as getOneDB,
  getAll as getAllDB,
  createOne as createOneDB,
  deleteOne as deleteOneDB,
  updateOne as updateOneDB,
} from './tarifas.repository.js';

export const getAll = async () => {
  const tarifas = await getAllDB();
  return tarifas;
};

export const getOne = async (id) => {
  const tarifa = await getOneDB(id);
  return tarifa;
};

export const createOne = async (data) => {
  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: validar precios positivos, rangos de edad válidos, etc.

  const newTarifa = await createOneDB(data);
  return newTarifa;
};

export const deleteOne = async (id) => {
  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: verificar que no esté siendo usada en reservas activas

  const deletedTarifa = await deleteOneDB(id);
  return deletedTarifa;
};

export const updateOne = async (id, data) => {
  const tarifaExistente = await getOneDB(id);
  if (!tarifaExistente) {
    const error = new Error('Tarifa no encontrada.');
    error.status = 404;
    throw error;
  }

  // TODO: Implementar validaciones de negocio aquí
  // Ejemplo: validar cambios de precio, impacto en reservas existentes, etc.

  const updatedTarifa = await updateOneDB(id, data);
  return updatedTarifa;
};
