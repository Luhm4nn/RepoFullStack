import prisma from "../prisma/prisma.js";

export async function saveRefreshToken(userId, token) {
  // Borra tokens viejos del usuario (opcional, para un solo dispositivo)
  await prisma.refreshToken.deleteMany({ where: { userId } });
  return prisma.refreshToken.create({ data: { userId, token } });
}

export async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({ where: { token } });
}

export async function deleteRefreshToken(token) {
  return prisma.refreshToken.delete({ where: { token } });
}
