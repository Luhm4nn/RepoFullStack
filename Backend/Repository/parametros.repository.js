import prisma from "../Prisma/prisma.js";

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
  console.log("Nuevo parametro creado:", newParametro);
  return newParametro;
}

async function deleteOne(id) {
  const parametroEliminado = await prisma.parametro.delete({
    where: {
      idParametro: parseInt(id, 10),
    },
  });
  console.log(parametroEliminado);
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
  console.log("Parametro actualizado:");
  return updatedParametro;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
