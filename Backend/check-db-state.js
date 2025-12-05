import prisma from './prisma/prisma.js';

async function checkDatabaseState() {
    console.log('=== Verificando estado de la base de datos ===\n');

    // Contar películas
    const totalPeliculas = await prisma.pelicula.count();
    console.log(`📽️  Total de películas: ${totalPeliculas}`);

    // Contar salas
    const totalSalas = await prisma.sala.count();
    console.log(`🎭 Total de salas: ${totalSalas}`);

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

    console.log(`\n🎬 Total de funciones: ${totalFunciones}`);
    console.log(`   - Privadas: ${funcionesPrivadas}`);
    console.log(`   - Públicas: ${funcionesPublicas}`);
    console.log(`   - Inactivas: ${funcionesInactivas}`);

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

    console.log(`\n🎯 Películas en cartelera (con funciones públicas): ${peliculasEnCartelera.length}`);

    // Mostrar algunas funciones de ejemplo
    console.log('\n📋 Primeras 5 funciones:');
    const funcionesEjemplo = await prisma.funcion.findMany({
        take: 5,
        include: {
            pelicula: true,
            sala: true,
        },
    });

    funcionesEjemplo.forEach((funcion, index) => {
        console.log(`\n   ${index + 1}. ${funcion.pelicula.nombrePelicula}`);
        console.log(`      Sala: ${funcion.sala.nombreSala}`);
        console.log(`      Fecha: ${funcion.fechaHoraFuncion}`);
        console.log(`      Estado: ${funcion.estado}`);
    });

    await prisma.$disconnect();
}

checkDatabaseState().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
