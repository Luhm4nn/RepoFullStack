import prisma from "../prisma/prisma.js";

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

  for (let i=0; i < filas; i++) {
    const filaLetter = String.fromCharCode(65 + i); // A, B, C, D...

    for(let nroAsiento = 1; nroAsiento <= asientosPorFila; nroAsiento++) {
      const tipo = vipSeats.includes(`${filaLetter}${nroAsiento}`) ? "VIP" : "Normal";
      const idTarifa = tipo === "VIP" ? 2 : 1;
      asientosToCreate.push({
        idSala: parseInt(idSala, 10),
        filaAsiento: filaLetter,
        nroAsiento: nroAsiento,
        tipo: tipo,
        idTarifa: idTarifa,
      });
    }
  }

  const createdAsientos = await prisma.asiento.createMany({
    data: asientosToCreate,
  })
  return createdAsientos;
}

async function createOne(idSala, data) {
  const newAsiento = await prisma.asiento.create({
    data: {
      idSala: parseInt(idSala, 10),
      filaAsiento: data.filaAsiento,
      nroAsiento: parseInt(data.nroAsiento, 10),
      tipo: data.tipo,
      idTarifa: parseInt(data.idTarifa, 10),
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
      idTarifa: parseInt(data.idTarifa, 10),
    },
  });
  return updatedAsiento;
}

async function updateManyForSala(idSala, vipSeats = []) {
  await prisma.asiento.updateMany({
    where: {
      idSala: parseInt(idSala, 10),
    },
    data: {
      tipo: "Normal",
      idTarifa: 1,
    },
  });

  const updatedVipSeats = []

  if (vipSeats.length > 0) {
   
    for (const seat of vipSeats) {
    const filaAsiento = seat.charAt(0); 
    const nroAsiento = parseInt(seat.slice(1), 10);

    await prisma.asiento.update({
      where: {
        idSala_filaAsiento_nroAsiento: {
              idSala: parseInt(idSala, 10),
              filaAsiento: filaAsiento,
              nroAsiento: nroAsiento,
      }},
      data: {
        tipo: "VIP",
        idTarifa: 2,
      },
    });
    updatedVipSeats.push(seat);
  }
}
return updatedVipSeats;
}
          

export { getOne, getAll, createManyForSala, createOne, deleteOne, updateOne, updateManyForSala };
