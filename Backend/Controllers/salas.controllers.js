import { getOne, getAll, createOne, deleteOne, updateOne} from "../Repository/salas.repository.js";

// Controllers for Salas

export const getSalas = async (req, res) => {
    const salas = await getAll();
    if (!salas || salas.length === 0) {
        const error = new Error("No existen salas cargadas aún.");
        error.status = 404;
        throw error;
    }
    res.json(salas);
}

export const getSala = async (req, res, next) => {
    const sala = await getOne(req.params.id);
    if (!sala) {
      const error = new Error("Sala no encontrada.");
      error.status = 404;
      throw error;
    }
    res.json(sala);
};

export const createSala = async (req, res) => {
  const newSala = await createOne(req.body);
  if (!newSala) {
    const error = new Error("Error al crear la sala.");
    error.status = 400;
    throw error;
  }
  res.status(201).json(newSala);
};

export const deleteSala = async (req, res) => {
  try {
    const deletedSala = await deleteOne(req.params.id); 
    res.status(200).json({deletedSala}); // Enviar respuesta de éxito
    if (!deletedSala) {
      const error = new Error("Sala no encontrada para eliminar.");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    if (error.code === 'P2025') { // Código de error de Prisma para "Registro no encontrado"
      const notFoundError = new Error("Sala no encontrada para eliminar.");
      notFoundError.status = 404;
      throw notFoundError;// Lanzar error personalizado si la sala no se encuentra
    }
    throw error; // Lanzar error si ocurre otro tipo de error
  }
};

export const updateSala = async (req, res) => {
 const updatedSala = await updateOne(req.params.id, req.body);
 if (!updatedSala) {
    const error = new Error("Sala no encontrada para actualizar.");
    error.status = 404;
    throw error;
  }
 res.status(200).json(updatedSala);
  
};
