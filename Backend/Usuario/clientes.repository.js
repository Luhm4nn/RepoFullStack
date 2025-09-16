import prisma from "../prisma/prisma.js";

// Repository for Usuarios

async function getAll() {
  const usuarios = await prisma.usuario.findMany({
    include: {
      _count: {
        select: { reserva: true },
      },
    },
  });
  return usuarios;
}

async function getOne(dni) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
  return usuario;
}

async function createOne(data) {
  const newUsuario = await prisma.usuario.create({
    data: {
      DNI: data.DNI,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      contrasena: data.contrasena,
      rol: data.rol,
      telefono: data.telefono,
    },
  });
  return newUsuario;
}

async function deleteOne(dni) {
  const deletedUsuario = await prisma.usuario.delete({
    where: {
      DNI: parseInt(dni, 10),
    },
  });
  return deletedUsuario;
}

async function updateOne(dni, data) {
  const updatedUsuario = await prisma.usuario.update({
    where: {
      DNI: parseInt(dni, 10),
    },
    data: {
      DNI: data.DNI,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      contrasena: data.contrasena,
      rol: data.rol,
      telefono: data.telefono,
    },
  });
  return updatedUsuario;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
