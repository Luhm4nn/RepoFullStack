import prisma from '../prisma/prisma.js';

// Repository for Salas

async function getAll() {
  const salas = await prisma.sala.findMany();
  return salas;
}

async function getOne(param) {
  let sala;

  if (!isNaN(param)) {
    sala = await prisma.sala.findUnique({
      where: { idSala: parseInt(param, 10) },
    });
  } else {
    sala = await prisma.sala.findUnique({
      where: { nombreSala: param },
    });
  }

  return sala;
}

async function createOne(data) {
  const newSala = await prisma.sala.create({
    data: {
      nombreSala: data.nombreSala,
      ubicacion: data.ubicacion,
      filas: data.filas,
      asientosPorFila: data.asientosPorFila,
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
      nombreSala: data.nombreSala,
      ubicacion: data.ubicacion,
    },
  });
  return updatedSala;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
