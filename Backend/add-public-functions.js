import prisma from './prisma/prisma.js';
import logger from './utils/logger.js';

async function addPublicFunctions() {
    logger.info('=== Agregando funciones públicas ===\n');

    try {
        const peliculas = await prisma.pelicula.findMany({
            orderBy: { idPelicula: 'asc' }
        });

        const salas = await prisma.sala.findMany({
            orderBy: { idSala: 'asc' }
        });

        if (peliculas.length === 0) {
            logger.info('❌ No hay películas en la base de datos');
            return;
        }

        if (salas.length === 0) {
            logger.info('❌ No hay salas en la base de datos');
            return;
        }

        logger.info(`📽️  Películas encontradas: ${peliculas.length}`);
        logger.info(`🎭 Salas encontradas: ${salas.length}\n`);

        // Crear funciones para las primeras películas
        const funcionesACrear = [];
        const hoy = new Date();

        // Tomar las primeras 6 películas y crear funciones para ellas
        const peliculasParaFunciones = peliculas.slice(0, Math.min(6, peliculas.length));

        peliculasParaFunciones.forEach((pelicula, index) => {
            // Crear 2-3 funciones por película en diferentes horarios
            const horarios = ['14:00', '17:30', '20:00'];
            const diasAdelante = index % 3; // Distribuir en los próximos 3 días

            horarios.slice(0, 2).forEach((horario, horarioIndex) => {
                const fecha = new Date(hoy);
                fecha.setDate(fecha.getDate() + diasAdelante);
                const [hora, minutos] = horario.split(':');
                fecha.setHours(parseInt(hora), parseInt(minutos), 0, 0);

                // Usar diferentes salas
                const salaIndex = (index + horarioIndex) % salas.length;

                funcionesACrear.push({
                    pelicula: pelicula.nombrePelicula,
                    idPelicula: pelicula.idPelicula,
                    sala: salas[salaIndex].nombreSala,
                    idSala: salas[salaIndex].idSala,
                    fechaHoraFuncion: fecha,
                    estado: 'Publica'
                });
            });
        });

        logger.info(`📋 Funciones a crear: ${funcionesACrear.length}\n`);

        // Crear las funciones
        let creadas = 0;
        let errores = 0;

        for (const funcion of funcionesACrear) {
            try {
                // Verificar si ya existe una función en esa sala y horario
                const existente = await prisma.funcion.findUnique({
                    where: {
                        idSala_fechaHoraFuncion: {
                            idSala: funcion.idSala,
                            fechaHoraFuncion: funcion.fechaHoraFuncion
                        }
                    }
                });

                if (existente) {
                    logger.info(`⚠️  Ya existe: ${funcion.pelicula} en ${funcion.sala} - ${funcion.fechaHoraFuncion.toLocaleString('es-AR')}`);
                    continue;
                }

                await prisma.funcion.create({
                    data: {
                        idSala: funcion.idSala,
                        idPelicula: funcion.idPelicula,
                        fechaHoraFuncion: funcion.fechaHoraFuncion,
                        estado: funcion.estado
                    }
                });

                logger.info(`✅ Creada: ${funcion.pelicula} en ${funcion.sala} - ${funcion.fechaHoraFuncion.toLocaleString('es-AR')}`);
                creadas++;
            } catch (error) {
                logger.info(`❌ Error: ${funcion.pelicula} - ${error.message}`);
                errores++;
            }
        }

        logger.info(`\n=== Resumen ===`);
        logger.info(`✅ Funciones creadas: ${creadas}`);
        logger.info(`❌ Errores: ${errores}`);
        logger.info(`⚠️  Ya existentes: ${funcionesACrear.length - creadas - errores}`);

        // Mostrar resumen final
        const totalFuncionesPublicas = await prisma.funcion.count({
            where: { estado: 'Publica' }
        });

        const peliculasEnCartelera = await prisma.pelicula.count({
            where: {
                funcion: {
                    some: {
                        estado: 'Publica'
                    }
                }
            }
        });

        logger.info(`\n📊 Estado final:`);
        logger.info(`   - Funciones públicas totales: ${totalFuncionesPublicas}`);
        logger.info(`   - Películas en cartelera: ${peliculasEnCartelera}`);

    } catch (error) {
        logger.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

addPublicFunctions().catch((error) => {
    logger.error('Error fatal:', error);
    process.exit(1);
});
