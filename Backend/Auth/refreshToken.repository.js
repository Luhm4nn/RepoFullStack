import prisma from "../prisma/prisma.js";

export async function saveRefreshToken(userId, token) {
  await prisma.refresh_token.deleteMany({ where: { userId } });
  return prisma.refresh_token.create({ data: { userId, token } });
}

export async function findRefreshToken(token) {
  return prisma.refresh_token.findUnique({ where: { token } });
}

export async function deleteRefreshToken(token) {
  return prisma.refresh_token.delete({ where: { token } });
}
