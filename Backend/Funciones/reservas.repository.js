import prisma from "../prisma/prisma.js";

// Repository for Reservas

async function getAll() {
  const reservas = await prisma.reserva.findMany({
    include: {
      funcion: {
        include: {
          sala: true,
          pelicula: true,
        },
      },
    },
  });
  return reservas;
}

async function getOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const reserva = await prisma.reserva.findUnique({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala,
          10
        ),
        fechaHoraFuncion:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
  });
  return reserva;
}

const removeMilliseconds = (date) => {
    if (!date) return null;
    const newDate = new Date(date);
    newDate.setMilliseconds(0); 
    return newDate;
};

async function createOne(data) {

  const fechaFuncionDate = removeMilliseconds(data.fechaHoraFuncion); 
  
  const fechaReservaDate = data.fechaHoraReserva 
    ? removeMilliseconds(data.fechaHoraReserva)
    : removeMilliseconds(new Date());

  const newReserva = await prisma.reserva.create({
    data: {
      idSala: parseInt(data.idSala, 10),
      fechaHoraFuncion: fechaFuncionDate,
      DNI: parseInt(data.DNI, 10),
      estado: "ACTIVA",
      fechaHoraReserva: fechaReservaDate,
      total: parseFloat(data.total),
    },
  });
  return newReserva;
}

async function deleteOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const deletedReserva = await prisma.reserva.delete({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala,
          10
        ),
        fechaHoraFuncion:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
  });
  return deletedReserva;
}

async function cancellOne(idSala_fechaHoraFuncion_DNI_fechaHoraReserva) {
  const cancelledReserva = await prisma.reserva.update({
    where: {
      idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
        idSala: parseInt(
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala,
          10
        ),
        fechaHoraFuncion:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva:
          idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
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
