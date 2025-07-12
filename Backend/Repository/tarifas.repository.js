import prisma from "../Prisma/prisma.js";

// Repository for Tarifas

async function getAll() {
  const tarifas = await prisma.tarifa.findMany();
  return tarifas;
}

async function getOne(id) {
  const tarifa = await prisma.tarifa.findUnique({
    where: {
      idTarifa: parseInt(id, 10),
    },
  });
  return tarifa;
}

async function createOne(data) {
  const newTarifa = await prisma.tarifa.create({
    data: {
      precio: data.precio,
      descripcionTarifa: data.descripcionTarifa,
      fechaDesde: data.fechaDesde,
    },
  });
  return newTarifa;
}

async function deleteOne(id) {
  const deletedTarifa = await prisma.tarifa.delete({
    where: {
      idTarifa: parseInt(id, 10),
    },
  });
  return deletedTarifa;
}

async function updateOne(id, data) {
  const updatedTarifa = await prisma.tarifa.update({
    where: {
      idTarifa: parseInt(id, 10),
    },
    data: {
      precio: data.precio,
      descripcionTarifa: data.descripcionTarifa,
      fechaDesde: data.fechaDesde,
    },
  });
  return updatedTarifa;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
