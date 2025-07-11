import prisma from "../Prisma/prisma.js";

// Repository for Clientes

async function getAll() {
  const clientes = await prisma.cliente.findMany();
  return clientes;
}

async function getOne(dni) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
  return cliente;
}

async function createOne(data) {
  const newCliente = await prisma.cliente.create({
    data: {
      DNI: data.DNI,
      nombreCliente: data.nombreCliente,
      apellidoCliente: data.apellidoCliente,
      email: data.email,
      telefono: data.telefono,
    },
  });
  console.log("Nuevo cliente creado:", newCliente);
  return newCliente;
}

async function deleteOne(dni) {
  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: {
        DNI: parseInt(dni, 10),
      },
    });
    console.log(clienteEliminado);
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Error: Cliente no encontrado para eliminar."); //Error de Prisma para "Registro no encontrado"
      return null; // Cliente no encontrado
    }
    throw error;
  }
}

async function updateOne(dni, data) {
  try {
    const updatedCliente = await prisma.cliente.update({
      where: {
        DNI: parseInt(dni, 10),
      },
      data: {
        DNI: data.DNI,
        nombreCliente: data.nombreCliente,
        apellidoCliente: data.apellidoCliente,
        email: data.email,
        telefono: data.telefono,
      },
    });
    console.log("Cliente actualizado:");
    return updatedCliente;
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Error: Cliente no encontrado para actualizar.");
    }
  }
}

export { getOne, getAll, createOne, deleteOne, updateOne };
