import prisma from '../prisma/prisma.js';

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
        idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    },
  });
  return reserva;
}

const removeMilliseconds = (date) => {
  if (!date) return null;

  // Si ya es un objeto Date
  if (date instanceof Date) {
    const newDate = new Date(date);
    newDate.setMilliseconds(0);
    return newDate;
  }

  // Si es un string
  const newDate = new Date(date);
  newDate.setMilliseconds(0);
  return newDate;
};

async function createOne(data) {
  console.log('📥 createOne reserva recibió:', data);

  // Validar datos requeridos
  if (!data.idSala || !data.fechaHoraFuncion || !data.DNI || !data.total) {
    const error = new Error('Faltan datos requeridos para crear la reserva');
    error.details = {
      idSala: !!data.idSala,
      fechaHoraFuncion: !!data.fechaHoraFuncion,
      DNI: !!data.DNI,
      total: !!data.total,
    };
    console.error('Validación falló:', error.details);
    throw error;
  }

  // Parsear y validar números
  const idSala = parseInt(data.idSala, 10);
  const DNI = parseInt(data.DNI, 10);
  const total = parseFloat(data.total);

  if (isNaN(idSala) || isNaN(DNI) || isNaN(total)) {
    const error = new Error('Datos numéricos inválidos');
    error.details = {
      idSala: data.idSala,
      DNI: data.DNI,
      total: data.total,
    };
    console.error('Conversión numérica falló:', error.details);
    throw error;
  }

  // Procesar fechas
  const fechaFuncionDate = removeMilliseconds(data.fechaHoraFuncion);
  const fechaReservaDate = data.fechaHoraReserva
    ? removeMilliseconds(data.fechaHoraReserva)
    : removeMilliseconds(new Date());

  if (!fechaFuncionDate || !fechaReservaDate) {
    const error = new Error('Fechas inválidas');
    error.details = {
      fechaHoraFuncion: data.fechaHoraFuncion,
      fechaHoraReserva: data.fechaHoraReserva,
    };
    console.error('Procesamiento de fechas falló:', error.details);
    throw error;
  }

  const reservaData = {
    idSala,
    fechaHoraFuncion: fechaFuncionDate,
    DNI,
    estado: 'ACTIVA',
    fechaHoraReserva: fechaReservaDate,
    total,
  };

  try {
    const newReserva = await prisma.reserva.create({
      data: reservaData,
    });

    console.log('Reserva creada exitosamente:', newReserva);
    return newReserva;
  } catch (error) {
    console.error('Código de error:', error.code);
    console.error('Meta:', error.meta);
    throw error;
  }
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
  // Usar una transacción para asegurar que ambas operaciones se completen
  const result = await prisma.$transaction(async (tx) => {
    const cancelledReserva = await tx.reserva.update({
      where: {
        idSala_fechaHoraFuncion_DNI_fechaHoraReserva: {
          idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
          fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
          DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
          fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
        },
      },
      data: {
        estado: 'CANCELADA',
        fechaHoraCancelacion: new Date(),
      },
    });

    await tx.asiento_reserva.deleteMany({
      where: {
        idSala: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.idSala, 10),
        fechaHoraFuncion: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraFuncion,
        DNI: parseInt(idSala_fechaHoraFuncion_DNI_fechaHoraReserva.DNI, 10),
        fechaHoraReserva: idSala_fechaHoraFuncion_DNI_fechaHoraReserva.fechaHoraReserva,
      },
    });

    return cancelledReserva;
  });

  return result;
}

export { getOne, getAll, createOne, deleteOne, cancellOne };
