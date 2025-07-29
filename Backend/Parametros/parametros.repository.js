import prisma from "../prisma/prisma.js";

// Repository for Parametros

async function getAll() {
  const parametros = await prisma.parametro.findMany();
  return parametros;
}

async function getOne(id) {
  const parametro = await prisma.parametro.findUnique({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
  return parametro;
}

async function createOne(data) {
  const newParametro = await prisma.parametro.create({
    data: {
      descripcionParametro: data.descripcionParametro,
      valor: data.valor,
    },
  });
  return newParametro;
}

async function deleteOne(id) {
  const deletedParametro = await prisma.parametro.delete({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
  return deletedParametro;
}

async function updateOne(id, data) {
  const updatedParametro = await prisma.parametro.update({
    where: {
      idParametro: parseInt(id, 10),
    },
    data: {
      descripcionParametro: data.descripcionParametro,
      valor: data.valor,
    },
  });
  return updatedParametro;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
