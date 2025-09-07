import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./funciones.service.js";

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
  if (newFuncion && newFuncion.name === "Solapamiento") {
    return res.status(newFuncion.status).json({ 
      message: newFuncion.message,
      errorCode: "SOLAPAMIENTO_FUNCIONES" 
    });
  }
  if (newFuncion && newFuncion.name === "FechaEstreno") {
    return res.status(newFuncion.status).json({ 
      message: newFuncion.message,
      errorCode: "FECHA_ESTRENO_INVALIDA" 
    });
  }
  res.status(201).json(newFuncion);
};

export const deleteFuncion = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: "Función eliminada correctamente." });
};

export const updateFuncion = async (req, res) => {
  const funcion = await getOne(req.params);

  // allows changes only when estado = "Privada", else can only change estado
  if (req.body.estado && (req.body.estado === 'Privada' || req.body.estado === 'Publica')) {
    const updatedFuncion = await updateOne(req.params, req.body);
    res.status(200).json(updatedFuncion);
  } 
  else if (funcion.estado === "Privada") {
    const updatedFuncion = await updateOne(req.params, req.body);

    //handle overlap and estreno error
    if (updatedFuncion) {
      if (updatedFuncion.name === "Solapamiento") {
        return res.status(updatedFuncion.status).json({
          message: updatedFuncion.message,
          errorCode: "SOLAPAMIENTO_FUNCIONES"
        });
      } else if (updatedFuncion.name === "FechaEstreno") {
        return res.status(updatedFuncion.status).json({
          message: updatedFuncion.message,
          errorCode: "FECHA_ESTRENO_INVALIDA"
        });
      }
    }
    res.status(200).json(updatedFuncion);
  } else {
    res.status(403).json({ message: "No se puede actualizar una función pública, excepto para cambiar su estado." });
  }
};
