import prisma from "../Prisma/prisma.js";

// Repository for AsientoReservas

async function getAll() {
  const asientoreservas = await prisma.asiento_reserva.findMany();
  return asientoreservas;
}

async function getOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const asientoreserva = await prisma.asiento_reserva.findUnique({
    where: {
        idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento, 10),
        fechaHoraFuncion: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return asientoreserva;
}

async function createOne(data) {
  const newAsientoReserva = await prisma.asiento_reserva.create({
    data: {
      idSala: parseInt(data.idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      fechaHoraFuncion: new Date(data.fechaHoraFuncion),
      DNI: parseInt(data.DNI, 10),
      fechaHoraReserva: new Date(data.fechaHoraReserva),
    },
  });
  return newAsientoReserva;
}


async function deleteOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const deletedAsientoReserva = await prisma.asiento_reserva.delete({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
      idSala: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala, 10),
      filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
      nroAsiento: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento, 10),
      fechaHoraFuncion: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return deletedAsientoReserva;
}

async function updateOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const updatedReserva = await prisma.asiento_reserva.update({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento, 10),
        fechaHoraFuncion: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
    data: {
      idSala: parseInt(data.idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      fechaHoraFuncion: data.fechaHoraFuncion,
      DNI: parseInt(data.DNI, 10),
      fechaHoraReserva: data.fechaHoraReserva,
    },
  });
  return updatedReserva;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
