import prisma from '../prisma/prisma.js';

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

async function createManyForSala(idSala, filas, asientosPorFila, vipSeats = []) {
  const asientosToCreate = [];
  const parsedIdSala = parseInt(idSala, 10);
  const parsedFilas = parseInt(filas, 10);
  const parsedAsientosPorFila = parseInt(asientosPorFila, 10);

  for (let i = 0; i < parsedFilas; i++) {
    const filaLetter = String.fromCharCode(65 + i); // A, B, C, D...

    for (let nroAsiento = 1; nroAsiento <= parsedAsientosPorFila; nroAsiento++) {
      const seatId = `${filaLetter}${nroAsiento}`;
      const tipo = vipSeats.includes(seatId) ? 'VIP' : 'Normal';
      const idTarifa = tipo === 'VIP' ? 2 : 1;

      asientosToCreate.push({
        idSala: parsedIdSala,
        filaAsiento: filaLetter,
        nroAsiento: nroAsiento,
        tipo: tipo,
        idTarifa: idTarifa,
      });
    }
  }

  const createdAsientos = await prisma.asiento.createMany({
    data: asientosToCreate,
  });

  return createdAsientos;
}

async function createOne(idSala, data) {
  const newAsiento = await prisma.asiento.create({
    data: {
      idSala: parseInt(idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      tipo: data.tipo,
      idTarifa: data.idTarifa ? parseInt(data.idTarifa, 10) : null,
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
      idTarifa: data.idTarifa ? parseInt(data.idTarifa, 10) : null,
    },
  });
  return updatedAsiento;
}

async function updateManyForSala(idSala, vipSeats = []) {
  const parsedIdSala = parseInt(idSala, 10);

  try {
    const resetResult = await prisma.asiento.updateMany({
      where: {
        idSala: parsedIdSala,
      },
      data: {
        tipo: 'Normal',
        idTarifa: 1,
      },
    });
    const updatedVipSeats = [];

    if (Array.isArray(vipSeats) && vipSeats.length > 0) {
      for (const seat of vipSeats) {
        // Validar formato del asiento (ej: "A1", "B12")
        if (typeof seat !== 'string' || seat.length < 2) {
          console.warn(`Formato de asiento inválido: ${seat}`);
          continue;
        }

        const filaAsiento = seat.charAt(0);
        const nroAsientoStr = seat.slice(1);
        const nroAsiento = parseInt(nroAsientoStr, 10);

        if (isNaN(nroAsiento)) {
          console.warn(`Número de asiento inválido: ${seat}`);
          continue;
        }

        try {
          await prisma.asiento.update({
            where: {
              idSala_filaAsiento_nroAsiento: {
                idSala: parsedIdSala,
                filaAsiento: filaAsiento,
                nroAsiento: nroAsiento,
              },
            },
            data: {
              tipo: 'VIP',
              idTarifa: 2,
            },
          });
          updatedVipSeats.push(seat);
        } catch (updateError) {
          console.error(`Error actualizando asiento ${seat}:`, updateError.message);
          // Continuar con el siguiente asiento
        }
      }
    }

    return updatedVipSeats;
  } catch (error) {
    throw error;
  }
}

export { getOne, getAll, createManyForSala, createOne, deleteOne, updateOne, updateManyForSala };
