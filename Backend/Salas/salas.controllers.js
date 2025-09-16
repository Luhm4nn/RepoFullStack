import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./salas.service.js";

import {createManyForSala, updateManyForSala} from "./asientos.repository.js";

// Controllers for Salas

export const getSalas = async (req, res) => {
  const salas = await getAll();
  res.json(salas);
};

export const getSala = async (req, res) => {
  const { param } = req.params;
  const sala = await getOne(param);
  res.json(sala);
};

export const getAsientos = async (req, res) => {
  const { id } = req.params;
  const asientos = await asientosRepository.getAll(id);
  res.json(asientos);
}

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
  await updateManyForSala(req.params.id, req.body.vipSeats || []);
  res.status(200).json(updatedSala);
};
