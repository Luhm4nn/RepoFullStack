import prisma from "../Prisma/prisma.js";

// Repository for Reservas

async function getAll() {
  const reservas = await prisma.reserva.findMany();
  return reservas;
}

async function getOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const reserva = await prisma.reserva.findUnique({
    where: {
        idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
  });
  return reserva;
}

async function createOne(data) {
  const fechaHoraReserva = new Date();
  const newReserva = await prisma.reserva.create({
    data: {
      idSala: parseInt(data.idSala, 10),
      fechaHoraFuncion: data.fechaHoraFuncion,
      DNI: parseInt(data.DNI, 10),
      estado: "ACTIVA",
      fechaHoraReserva: data.fechaHoraReserva ? new Date(data.fechaHoraReserva) : new Date(),
      total: parseFloat(data.total),
    },
  });
  return newReserva;
}


async function deleteOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const deletedReserva = await prisma.reserva.delete({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
  });
  return deletedReserva;
}

async function cancellOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const cancelledReserva = await prisma.reserva.update({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
    data: {
      estado: "CANCELADA",
      fechaHoraCancelacion: new Date(),
    },
  });
  return cancelledReserva;
}

export { getOne, getAll, createOne, deleteOne, cancellOne };
