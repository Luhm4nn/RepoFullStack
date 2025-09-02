import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./funciones.repository.js";

// Controllers for Funciones

export const getFunciones = async (req, res) => {
  const funciones = await getAll();
  res.json(funciones);
};

export const getFuncion = async (req, res, next) => {
  const funcion = await getOne(req.params);
  if (!funcion) {
    const error = new Error("Función no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(funcion);
};

export const createFuncion = async (req, res) => {
  const newFuncion = await createOne(req.body);
  res.status(201).json(newFuncion);
};

export const deleteFuncion = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: "Función eliminada correctamente." });
};

export const updateFuncion = async (req, res) => {
  const funcion = await getOne(req.params);
  
  // Permitir cambio de estado entre Privada y Publica
  if (req.body.estado && (req.body.estado === 'Privada' || req.body.estado === 'Publica')) {
    const updatedFuncion = await updateOne(req.params, req.body);
    res.status(200).json(updatedFuncion);
  } 
  // Para otros cambios, solo permitir si la función está privada
  else if (funcion.estado === "Privada") {
    const updatedFuncion = await updateOne(req.params, req.body);
    res.status(200).json(updatedFuncion);
  } else {
    res.status(403).json({ message: "No se puede actualizar una función pública, excepto para cambiar su estado." });
  }
};
