import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./salas.repository.js";

import {createManyForSala} from "./asientos.repository.js";

// Controllers for Salas

export const getSalas = async (req, res) => {
  const salas = await getAll();
  if (!salas || salas.length === 0) {
    const error = new Error("No existen salas cargadas aún.");
    error.status = 404;
    throw error;
  }
  res.json(salas);
};

export const getSala = async (req, res) => {
  const sala = await getOne(req.params.id);
  res.json(sala);
};

export const createSala = async (req, res) => {
  const newSala = await createOne(req.body);

  const asientosToCreate = await createManyForSala(
    newSala.idSala,
    req.body.filas,
    req.body.asientosPorFila,
    req.body.vipSeats
  );

  res.status(201).json(newSala);

};


export const deleteSala = async (req, res) => {
  const deletedSala = await deleteOne(req.params.id);
  res.status(200).json({ message: "Sala eliminada correctamente." });
};

export const updateSala = async (req, res) => {
  const updatedSala = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedSala);
};
