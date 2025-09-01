import prisma from "../prisma/prisma.js";

// Repository for Funciones

async function getAll() {
  const funciones = await prisma.funcion.findMany({
    include: {
      sala: true,
      pelicula: true,
    },
  });
  return funciones;
}

async function getOne(idSala_fechaHoraFuncion) {
  const funcion = await prisma.funcion.findUnique({
    where: {
      idSala_fechaFuncion_horaInicioFuncion: {
        idSala: parseInt(idSala_fechaHoraFuncion.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return funcion;
}

async function createOne(data) {
  const { idSala, idPelicula, fechaHoraFuncion } = data;
  const newFuncion = await prisma.funcion.create({
    data: {
      fechaHoraFuncion: new Date(fechaHoraFuncion),
      idSala: parseInt(idSala, 10),
      idPelicula: parseInt(idPelicula, 10),
    },
  });
  return newFuncion;
}

async function deleteOne(idSala_fechaHoraFuncion) {
  const deletedFuncion = await prisma.funcion.delete({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala_fechaHoraFuncion.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return deletedFuncion;
}

async function updateOne(idSala_fechaHoraFuncion, data) {
  const updatedFuncion = await prisma.funcion.update({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala_fechaHoraFuncion.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
    data: {
      idSala: parseInt(data.idSala, 10),
      fechaHoraFuncion: new Date(data.fechaHoraFuncion),
      idPelicula: parseInt(data.idPelicula, 10),
    },
  });
  return updatedFuncion;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
