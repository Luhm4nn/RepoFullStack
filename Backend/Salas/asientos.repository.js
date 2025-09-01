import prisma from "../prisma/prisma.js";

// Repository for Asientos

async function getAll(idSala) {
  const asientos = await prisma.asiento.findMany({
    where: {
      idSala: parseInt(idSala, 10),
    },
    include: {
      tarifa: true,
      sala: true,
    },
  });
  return asientos;
}

async function getOne(idSala_filaAsiento_nroAsiento) {
  const asiento = await prisma.asiento.findUnique({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala_filaAsiento_nroAsiento.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento.nroAsiento, 10),
      },
    },
  });
  return asiento;
}

async function createOne(idSala, data) {
  const newAsiento = await prisma.asiento.create({
    data: {
      idSala: parseInt(idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      tipo: data.tipo,
      idTarifa: parseInt(data.idTarifa, 10),
    },
  });
  return newAsiento;
}

async function deleteOne(idSala_filaAsiento_nroAsiento) {
  const deletedAsiento = await prisma.asiento.delete({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala_filaAsiento_nroAsiento.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento.nroAsiento, 10),
      },
    },
  });
  return deletedAsiento;
}

async function updateOne(idSala_filaAsiento_nroAsiento, data) {
  const updatedAsiento = await prisma.asiento.update({
    where: {
      idSala_filaAsiento_nroAsiento: {
        idSala: parseInt(idSala_filaAsiento_nroAsiento.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento.nroAsiento, 10),
      },
    },
    data: {
      tipo: data.tipo,
      idTarifa: parseInt(data.idTarifa, 10),
    },
  });
  return updatedAsiento;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
