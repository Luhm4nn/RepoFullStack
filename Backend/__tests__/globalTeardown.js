import prisma from '../prisma/prisma.js';

export default async function globalTeardown() {
  await prisma.$disconnect();
}
