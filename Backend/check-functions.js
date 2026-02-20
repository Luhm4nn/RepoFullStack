import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const hoy = new Date();
    const semana = new Date();
    semana.setDate(semana.getDate() + 6);

    const funciones = await prisma.funcion.findMany({
      include: { pelicula: true },
    });

    console.log(`Total Funciones: ${funciones.length}`);
    funciones.forEach((f) => {
      const isPublic = f.estado === 'PUBLICA' || f.estado === 'Publica';
      const fDate = new Date(f.fechaHoraFuncion);
      const isSoon = fDate >= hoy && fDate <= semana;
      console.log(
        `- Película: ${f.pelicula.nombrePelicula}, Fecha: ${f.fechaHoraFuncion}, Estado: ${f.estado}, En Cartelera? ${isPublic && isSoon}`
      );
    });
  } catch (err) {
    console.error('Error checking functions:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
