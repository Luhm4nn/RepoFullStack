import e from 'express';
import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
  getFuncionesByPeliculaAndFechaService,
  getActiveFunciones as getActiveFuncionesService,
  getInactiveFunciones as getInactiveFuncionesService,
} from './funciones.service.js';

// Controllers for Funciones

export const getFuncionesSemana = async (req, res) => {
  const { idPelicula } = req.params;
  const funciones = await getFuncionesByPeliculaAndFechaService(idPelicula, 'semana');
  res.json(funciones);
};

export const getFunciones = async (req, res) => {
  const { estado } = req.query;

  let funciones;

  switch (estado?.toLowerCase()) {
    case 'activas':
      funciones = await getActiveFuncionesService();
      break;
    case 'inactivas':
      funciones = await getInactiveFuncionesService();
      break;
    case 'todas':
      funciones = await getAll();
      break;
    default:
      // default to 'activas' if no valid estado is provided
      funciones = await getActiveFuncionesService();
      break;
  }

  res.json(funciones);
};

export const getFuncionesByPeliculaAndFecha = async (req, res) => {
  const { idPelicula, fecha } = req.params;
  const funciones = await getFuncionesByPeliculaAndFechaService(idPelicula, fecha);
  res.json(funciones);
};

export const getActiveFuncionesEndpoint = async (req, res) => {
  const funciones = await getActiveFuncionesService();
  res.json(funciones);
};

export const getInactiveFuncionesEndpoint = async (req, res) => {
  const funciones = await getInactiveFuncionesService();
  res.json(funciones);
};

export const getFuncion = async (req, res, next) => {
  const funcion = await getOne(req.params);
  if (!funcion) {
    const error = new Error('Función no encontrada.');
    error.status = 404;
    throw error;
  }
  res.json(funcion);
};

export const createFuncion = async (req, res) => {
  const newFuncion = await createOne(req.body);
  if (newFuncion && newFuncion.name === 'SOLAPAMIENTO_FUNCIONES') {
    return res.status(newFuncion.status).json({
      message: newFuncion.message,
      errorCode: newFuncion.name,
    });
  }
  if (newFuncion && newFuncion.name === 'FECHA_ESTRENO_INVALIDA') {
    return res.status(newFuncion.status).json({
      message: newFuncion.message,
      errorCode: newFuncion.name,
    });
  }
  res.status(201).json(newFuncion);
};

export const deleteFuncion = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: 'Función eliminada correctamente.' });
};

export const updateFuncion = async (req, res) => {
  const updatedFuncion = await updateOne(req.params, req.body);
  if (updatedFuncion) {
    if (updatedFuncion.name === 'SOLAPAMIENTO_FUNCIONES') {
      return res.status(updatedFuncion.status).json({
        message: updatedFuncion.message,
        errorCode: updatedFuncion.name,
      });
    } else if (updatedFuncion.name === 'FECHA_ESTRENO_INVALIDA') {
      return res.status(updatedFuncion.status).json({
        message: updatedFuncion.message,
        errorCode: updatedFuncion.name,
      });
    }
  }

  res.status(200).json(updatedFuncion);
};
