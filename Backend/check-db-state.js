import prisma from './prisma/prisma.js';
import logger from './utils/logger.js';

async function checkDatabaseState() {
    logger.info('=== Verificando estado de la base de datos ===\n');

    // Contar películas
    const totalPeliculas = await prisma.pelicula.count();
    logger.info(`📽️  Total de películas: ${totalPeliculas}`);

    // Contar salas
    const totalSalas = await prisma.sala.count();
    logger.info(`🎭 Total de salas: ${totalSalas}`);

    // Contar funciones por estado
    const funcionesPrivadas = await prisma.funcion.count({
        where: { estado: 'Privada' }
    });
    const funcionesPublicas = await prisma.funcion.count({
        where: { estado: 'Publica' }
    });
    const funcionesInactivas = await prisma.funcion.count({
        where: { estado: 'Inactiva' }
    });
    const totalFunciones = await prisma.funcion.count();

    logger.info(`\n🎬 Total de funciones: ${totalFunciones}`);
    logger.info(`   - Privadas: ${funcionesPrivadas}`);
    logger.info(`   - Públicas: ${funcionesPublicas}`);
    logger.info(`   - Inactivas: ${funcionesInactivas}`);

    // Películas en cartelera (con funciones públicas)
    const peliculasEnCartelera = await prisma.pelicula.findMany({
        where: {
            funcion: {
                some: {
                    estado: 'Publica',
                },
            },
        },
    });

    logger.info(`\n🎯 Películas en cartelera (con funciones públicas): ${peliculasEnCartelera.length}`);

    // Mostrar algunas funciones de ejemplo
    logger.info('\n📋 Primeras 5 funciones:');
    const funcionesEjemplo = await prisma.funcion.findMany({
        take: 5,
        include: {
            pelicula: true,
            sala: true,
        },
    });

    funcionesEjemplo.forEach((funcion, index) => {
        logger.info(`\n   ${index + 1}. ${funcion.pelicula.nombrePelicula}`);
        logger.info(`      Sala: ${funcion.sala.nombreSala}`);
        logger.info(`      Fecha: ${funcion.fechaHoraFuncion}`);
        logger.info(`      Estado: ${funcion.estado}`);
    });

    await prisma.$disconnect();
}

checkDatabaseState().catch((error) => {
    logger.error('Error:', error);
    process.exit(1);
});
