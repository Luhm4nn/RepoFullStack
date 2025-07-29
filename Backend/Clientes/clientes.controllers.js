import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./clientes.repository.js";

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
  res.status(201).json(newCliente);
};

export const deleteCliente = async (req, res) => {
  await deleteOne(req.params.dni);
  res.status(200).json({ message: "Cliente eliminado correctamente." }); // Enviar respuesta de éxito
};

export const updateCliente = async (req, res) => {
  const updatedCliente = await updateOne(req.params.dni, req.body);
  res.status(200).json(updatedCliente);
};
