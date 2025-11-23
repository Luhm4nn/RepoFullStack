import { getOne, getAll, createOne, deleteOne, updateOne } from './parametros.service.js';

// Controllers for Parametros

export const getParametros = async (req, res) => {
  const parametros = await getAll();
  if (!parametros || parametros.length === 0) {
    const error = new Error('No existen parametros cargados aún.');
    error.status = 404;
    throw error;
  }
  res.json(parametros);
};

export const getParametro = async (req, res, next) => {
  const parametro = await getOne(req.params.id);
  if (!parametro) {
    const error = new Error('Parametro no encontrado.');
    error.status = 404;
    throw error;
  }
  res.json(parametro);
};

export const createParametro = async (req, res) => {
  const newParametro = await createOne(req.body);
  res.status(201).json(newParametro);
};

export const deleteParametro = async (req, res) => {
  await deleteOne(req.params.id);
  res.status(200).json({ message: 'Parametro eliminado correctamente.' });
};

export const updateParametro = async (req, res) => {
  const updatedParametro = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedParametro);
};
