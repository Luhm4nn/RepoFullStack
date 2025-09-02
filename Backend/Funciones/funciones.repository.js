import prisma from "../prisma/prisma.js";

// Repository for Funciones

async function getAllDB() {
  const funciones = await prisma.funcion.findMany({
    include: {
      sala: true,
      pelicula: true,
    },
  });
  return funciones;
}

async function getOneDB(idSala_fechaHoraFuncion) {
  const funcion = await prisma.funcion.findUnique({
    where: {
      idSala_fechaHoraFuncion: {
        idSala: parseInt(idSala_fechaHoraFuncion.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return funcion;
}

async function createOneDB(data) {
  const newFuncion = await prisma.funcion.create({
    data: {
      fechaHoraFuncion: new Date(data.fechaHoraFuncion),
      idSala: parseInt(data.idSala, 10),
      idPelicula: parseInt(data.idPelicula, 10),
      estado: "Privada"
    },
  });
  return newFuncion;
}

async function deleteOneDB(idSala_fechaHoraFuncion) {
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

async function updateOneDB(idSala_fechaHoraFuncion, data) {
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
      estado: data.estado,
    },
  });
  return updatedFuncion;
}

async function getFuncionesBySala(idSala) {
  const funciones = await prisma.funcion.findMany({
    where: {
      idSala: parseInt(idSala, 10),
    },
    include: {
      sala: true,
      pelicula: true,
    },
  });
  return funciones;
}

export { getAllDB, getOneDB, createOneDB, deleteOneDB, updateOneDB, getFuncionesBySala };
