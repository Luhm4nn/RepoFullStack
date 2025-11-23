import prisma from '../prisma/prisma.js';

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

const removeMilliseconds = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    const newDate = new Date(date);
    newDate.setMilliseconds(0);
    return newDate;
  }
  const newDate = new Date(date);
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
        idSala: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.idSala, 10),
        filaAsiento: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.filaAsiento,
        nroAsiento: parseInt(idSala_filaAsiento_nroAsiento_fechaHoraFuncion.nroAsiento, 10),
        fechaHoraFuncion: idSala_filaAsiento_nroAsiento_fechaHoraFuncion.fechaHoraFuncion,
      },
    },
  });
  return asientoreserva;
}

async function createMany(reservasArray) {
  console.log('createMany recibió:', {
    cantidad: reservasArray.length,
    primerElemento: reservasArray[0],
  });

  const dataToCreate = reservasArray.map((item, index) => {
    // Validar y convertir datos
    const idSala = parseInt(item.idSala, 10);
    const nroAsiento = parseInt(item.nroAsiento, 10);
    const DNI = parseInt(item.DNI, 10);

    if (isNaN(idSala) || isNaN(nroAsiento) || isNaN(DNI)) {
      console.error(`Error en item ${index}:`, {
        idSala: item.idSala,
        nroAsiento: item.nroAsiento,
        DNI: item.DNI,
      });
      throw new Error(`Datos inválidos en asiento ${index}`);
    }

    // Procesar fechas
    const fechaFuncion = removeMilliseconds(item.fechaHoraFuncion);
    const fechaReserva = removeMilliseconds(item.fechaHoraReserva);

    if (!fechaFuncion || !fechaReserva) {
      console.error(`Fechas inválidas en item ${index}:`, {
        fechaHoraFuncion: item.fechaHoraFuncion,
        fechaHoraReserva: item.fechaHoraReserva,
      });
      throw new Error(`Fechas inválidas en asiento ${index}`);
    }

    return {
      idSala,
      filaAsiento: item.filaAsiento,
      nroAsiento,
      fechaHoraFuncion: fechaFuncion,
      DNI,
      fechaHoraReserva: fechaReserva,
    };
  });

  console.log('📤 Datos procesados para crear:', {
    cantidad: dataToCreate.length,
    primerElemento: {
      ...dataToCreate[0],
      fechaHoraFuncion: dataToCreate[0].fechaHoraFuncion.toISOString(),
      fechaHoraReserva: dataToCreate[0].fechaHoraReserva.toISOString(),
    },
  });

  try {
    const newAsientoReservas = await prisma.asiento_reserva.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    console.log('Asientos reservados creados:', newAsientoReservas);
    return newAsientoReservas;
  } catch (error) {
    console.error('Error en createMany Prisma:', error);
    throw error;
  }
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

async function updateOne(idSala_filaAsiento_nroAsiento_fechaHoraFuncion, data) {
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
      fechaHoraFuncion: removeMilliseconds(data.fechaHoraFuncion),
      DNI: parseInt(data.DNI, 10),
      fechaHoraReserva: removeMilliseconds(data.fechaHoraReserva),
    },
  });
  return updatedReserva;
}

export {
  getOne,
  getAll,
  createMany,
  deleteOne,
  updateOne,
  getAsientosReservadosPorFuncion,
  cleanDateParam,
};
