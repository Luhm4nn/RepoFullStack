import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import logger from './utils/logger.js';

const prisma = new PrismaClient();

async function main() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const users = [
      {
        DNI: 11111111,
        nombreUsuario: 'Admin',
        apellidoUsuario: 'Sistem',
        email: 'admin@cutzy.com',
        contrasena: hashedPassword,
        rol: 'ADMIN',
      },
      {
        DNI: 22222222,
        nombreUsuario: 'User',
        apellidoUsuario: 'Standard',
        email: 'user@cutzy.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
      },
      {
        DNI: 33333333,
        nombreUsuario: 'Escáner',
        apellidoUsuario: 'Ticket',
        email: 'escaner@cutzy.com',
        contrasena: hashedPassword,
        rol: 'ESCANER',
      },
    ];

    for (const user of users) {
      const createdUser = await prisma.usuario.upsert({
        where: { email: user.email },
        update: {
          contrasena: user.contrasena,
          rol: user.rol,
        },
        create: user,
      });
      logger.info(`Usuario "${user.rol}" creado/actualizado: ${createdUser.email}`);
    }

    logger.info('Sembrado de usuarios completado exitosamente.');
  } catch (error) {
    logger.error('Error durante el seed de usuarios:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    logger.error('Error fatal en seed de usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
