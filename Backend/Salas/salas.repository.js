import prisma from "../prisma/prisma.js";

// Repository for Salas

async function getAll() {
  const salas = await prisma.sala.findMany();
  return salas;
}

async function getOne(id) {
  const sala = await prisma.sala.findUnique({
    where: {
      idSala: parseInt(id, 10),
    },
  });
  return sala;
}

async function createOne(data) {
  const newSala = await prisma.sala.create({
    data: {
      ubicacion: data.ubicacion,
      capacidad: data.capacidad,
    },
  });
  return newSala;
}

async function deleteOne(id) {
  const deletedSala = await prisma.sala.delete({
    where: {
      idSala: parseInt(id, 10),
    },
  });
  return deletedSala;
}

async function updateOne(id, data) {
  const updatedSala = await prisma.sala.update({
    where: {
      idSala: parseInt(id, 10),
    },
    data: {
      ubicacion: data.ubicacion,
      capacidad: data.capacidad,
    },
  });
  return updatedSala;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
