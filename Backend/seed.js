import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger.js';

const prisma = new PrismaClient();

async function main() {

  try {
    // 1. TARIFAS
    
    const tarifaNormal = await prisma.tarifa.upsert({
      where: { idTarifa: 1 },
      update: {
        precio: 11000.00,
        descripcionTarifa: 'Tarifa Normal',
        fechaDesde: new Date()
      },
      create: {
        idTarifa: 1,
        precio: 11000.00,
        descripcionTarifa: 'Tarifa Normal',
        fechaDesde: new Date()
      }
    });
    logger.info('Tarifa Normal creada/actualizada:', tarifaNormal.idTarifa);

    const tarifaVIP = await prisma.tarifa.upsert({
      where: { idTarifa: 2 },
      update: {
        precio: 16000.00,
        descripcionTarifa: 'Tarifa VIP',
        fechaDesde: new Date()
      },
      create: {
        idTarifa: 2,
        precio: 16000.00,
        descripcionTarifa: 'Tarifa VIP',
        fechaDesde: new Date()
      }
    });
    logger.info('Tarifa VIP creada/actualizada:', tarifaVIP.idTarifa);

    // 2. PARÁMETROS

    const parametros = [
      {
        descripcionParametro: 'Tiempo de Limpieza',
        valor: 30
      },
      {
        descripcionParametro: 'Tiempo máximo de reserva',
        valor: 15
      }
    ];

    for (const param of parametros) {
      const parametro = await prisma.parametro.upsert({
        where: {
          descripcionParametro: param.descripcionParametro
        },
        update: {
          valor: param.valor
        },
        create: {
          descripcionParametro: param.descripcionParametro,
          valor: param.valor
        }
      });
      logger.info(`Parámetro "${param.descripcionParametro}" creado/actualizado:`, parametro.idParametro);
    }

  } catch (error) {
    logger.error('Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    logger.error('Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });