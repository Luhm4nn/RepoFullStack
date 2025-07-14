import prisma from "../Prisma/prisma.js";

// Repository for Funciones

async function getAll() {
  const funciones = await prisma.funcion.findMany();
  return funciones;
}

async function getOne(idSala_fechaFuncion_horaInicioFuncion) {
  const funcion = await prisma.funcion.findUnique({
    where: {
      idSala_fechaFuncion_horaInicioFuncion: {
        idSala: parseInt(idSala_fechaFuncion_horaInicioFuncion.idSala, 10),
        fechaFuncion: idSala_fechaFuncion_horaInicioFuncion.fechaFuncion,
        horaInicioFuncion:
          idSala_fechaFuncion_horaInicioFuncion.horaInicioFuncion,
      },
    },
  });
  return funcion;
}

async function createOne(data) {
  const { idSala, idPelicula, fechaFuncion, horaInicioFuncion } = data;
  const fechaHoraISO = `${fechaFuncion}T${horaInicioFuncion}.000Z`;
  const newFuncion = await prisma.funcion.create({
    data: {
      fechaFuncion: new Date(fechaHoraISO),
      horaInicioFuncion: new Date(fechaHoraISO),
      idSala: parseInt(idSala, 10),
      idPelicula: parseInt(idPelicula, 10),
    },
  });
  return newFuncion;
}

async function deleteOne(idSala_fechaFuncion_horaInicioFuncion) {
  const deletedFuncion = await prisma.funcion.delete({
    where: {
      idSala_fechaFuncion_horaInicioFuncion: {
        idSala: parseInt(idSala_fechaFuncion_horaInicioFuncion.idSala, 10),
        fechaFuncion: new Date(
          idSala_fechaFuncion_horaInicioFuncion.fechaFuncion
        ),
        horaInicioFuncion: new Date(
          idSala_fechaFuncion_horaInicioFuncion.horaInicioFuncion
        ),
      },
    },
  });
  return deletedFuncion;
}

async function updateOne(idSala_fechaFuncion_horaInicioFuncion, data) {
  const updatedFuncion = await prisma.funcion.update({
    where: {
      idSala_fechaFuncion_horaInicioFuncion: {
        idSala: parseInt(idSala_fechaFuncion_horaInicioFuncion.idSala, 10),
        fechaFuncion: new Date(
          idSala_fechaFuncion_horaInicioFuncion.fechaFuncion
        ),
        horaInicioFuncion: new Date(
          idSala_fechaFuncion_horaInicioFuncion.horaInicioFuncion
        ),
      },
    },
    data: {
      idSala: parseInt(data.idSala, 10),
      fechaFuncion: new Date(data.fechaFuncion),
      horaInicioFuncion: new Date(data.horaInicioFuncion),
      idPelicula: parseInt(data.idPelicula, 10),
    },
  });
  return updatedFuncion;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
