import prisma from "../prisma/prisma.js";

// Repository for AsientoReservas

async function getAll() {
  const asientoreservas = await prisma.asiento_reserva.findMany();
  return asientoreservas;
}

const cleanDateParam = (dateString) => {
    const decodedString = decodeURIComponent(dateString); 
    const newDate = new Date(decodedString);
    newDate.setMilliseconds(0); 
    return newDate;
};

async function getAsientosReservadosPorFuncion(idSala, fechaHoraFuncionString) {
  const fechaFuncionDate = new Date(fechaHoraFuncionString);
  fechaFuncionDate.setMilliseconds(0);
  const reservados = await prisma.asiento_reserva.findMany({
    where: {
      idSala: parseInt(idSala, 10),
      fechaHoraFuncion: fechaFuncionDate,
    },
  });
  return reservados;
}

async function getOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const asientoreserva = await prisma.asiento_reserva.findUnique({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala,
          10
        ),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento,
          10
        ),
        fechaHoraFuncion:
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return asientoreserva;
}

async function createMany(reservasArray) {
  const dataToCreate = reservasArray.map(item => ({
    idSala: parseInt(item.idSala, 10),
    filaAsiento: item.filaAsiento,
    nroAsiento: parseInt(item.nroAsiento, 10),
    fechaHoraFuncion: new Date(item.fechaHoraFuncion), 
    DNI: parseInt(item.DNI, 10),
    fechaHoraReserva: new Date(item.fechaHoraReserva),
  }));

  const newAsientoReservas = await prisma.asiento_reserva.createMany({
    data: dataToCreate,
    skipDuplicates: true,
  });
  
  return newAsientoReservas;
}

async function deleteOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const deletedAsientoReserva = await prisma.asiento_reserva.delete({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala,
          10
        ),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento,
          10
        ),
        fechaHoraFuncion:
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return deletedAsientoReserva;
}

async function updateOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion) {
  const updatedReserva = await prisma.asiento_reserva.update({
    where: {
      idSala_filaAsiento_nroAsiento_fechaHoraFuncion: {
        idSala: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala,
          10
        ),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento,
          10
        ),
        fechaHoraFuncion:
          idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
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

export { getOne, getAll, createMany, deleteOne, updateOne, getAsientosReservadosPorFuncion, cleanDateParam };
