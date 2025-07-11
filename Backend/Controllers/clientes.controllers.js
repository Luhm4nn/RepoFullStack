import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "../Repository/clientes.repository.js";

// Controllers for Clientes

export const getClientes = async (req, res) => {
  const clientes = await getAll();
  if (!clientes || clientes.length === 0) {
    const error = new Error("No existen clientes cargados aún.");
    error.status = 404;
    throw error;
  }
  res.json(clientes);
};

export const getCliente = async (req, res, next) => {
  const cliente = await getOne(req.params.dni);
  if (!cliente) {
    const error = new Error("Cliente no encontrado.");
    error.status = 404;
    throw error;
  }
  res.json(cliente);
};

export const createCliente = async (req, res) => {
  const newCliente = await createOne(req.body);
  if (!newCliente) {
    const error = new Error("Error al crear el cliente.");
    error.status = 400;
    throw error;
  }
  res.status(201).json(newCliente);
};

export const deleteCliente = async (req, res) => {
  try {
    await deleteOne(req.params.dni);
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    if (error.code === "P2025") {
      const notFoundError = new Error("Cliente no encontrado para eliminar."); // Lanzar error personalizado si el cliente no se encuentra
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error; // Lanzar error si ocurre otro tipo de error
  }
};

export const updateCliente = async (req, res) => {
  const updatedCliente = await updateOne(req.params.dni, req.body);
  if (!updatedCliente) {
    const error = new Error("Cliente no encontrado para actualizar.");
    error.status = 404;
    throw error;
  }
  res.status(200).json(updatedCliente);
};
