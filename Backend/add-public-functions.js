import prisma from './prisma/prisma.js';

async function addPublicFunctions() {
    console.log('=== Agregando funciones públicas ===\n');

    try {
        // Obtener todas las películas
        const peliculas = await prisma.pelicula.findMany({
            orderBy: { idPelicula: 'asc' }
        });

        // Obtener todas las salas
        const salas = await prisma.sala.findMany({
            orderBy: { idSala: 'asc' }
        });

        if (peliculas.length === 0) {
            console.log('❌ No hay películas en la base de datos');
            return;
        }

        if (salas.length === 0) {
            console.log('❌ No hay salas en la base de datos');
            return;
        }

        console.log(`📽️  Películas encontradas: ${peliculas.length}`);
        console.log(`🎭 Salas encontradas: ${salas.length}\n`);

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

        console.log(`📋 Funciones a crear: ${funcionesACrear.length}\n`);

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
                    console.log(`⚠️  Ya existe: ${funcion.pelicula} en ${funcion.sala} - ${funcion.fechaHoraFuncion.toLocaleString('es-AR')}`);
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

                console.log(`✅ Creada: ${funcion.pelicula} en ${funcion.sala} - ${funcion.fechaHoraFuncion.toLocaleString('es-AR')}`);
                creadas++;
            } catch (error) {
                console.log(`❌ Error: ${funcion.pelicula} - ${error.message}`);
                errores++;
            }
        }

        console.log(`\n=== Resumen ===`);
        console.log(`✅ Funciones creadas: ${creadas}`);
        console.log(`❌ Errores: ${errores}`);
        console.log(`⚠️  Ya existentes: ${funcionesACrear.length - creadas - errores}`);

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

        console.log(`\n📊 Estado final:`);
        console.log(`   - Funciones públicas totales: ${totalFuncionesPublicas}`);
        console.log(`   - Películas en cartelera: ${peliculasEnCartelera}`);

    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

addPublicFunctions().catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
});
