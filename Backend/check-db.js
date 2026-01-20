import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const peliculasCount = await prisma.pelicula.count();
    const usuariosCount = await prisma.usuario.count();
    const funcionesCount = await prisma.funcion.count();
    const salasCount = await prisma.sala.count();
    const reservasCount = await prisma.reserva.count();
    const asientosReservadosCount = await prisma.asiento_reserva.count();

    console.log('--- Database Status ---');
    console.log(`Películas: ${peliculasCount}`);
    console.log(`Usuarios: ${usuariosCount}`);
    console.log(`Funciones: ${funcionesCount}`);
    console.log(`Salas: ${salasCount}`);
    console.log(`Reservas: ${reservasCount}`);
    console.log(`Asientos Reservados: ${asientosReservadosCount}`);
    console.log('-----------------------');

    const targetEmails = ['admin@cutzy.com', 'user@cutzy.com', 'escaner@cutzy.com'];
    const foundUsers = await prisma.usuario.findMany({
      where: { email: { in: targetEmails } }
    });
    console.log('Seeded Users Found:', foundUsers.map(u => ({ email: u.email, rol: u.rol })));

    if (usuariosCount > 0) {
      const users = await prisma.usuario.findMany({ take: 10 });
      console.log('User Emails:', users.map(u => u.email));
    }
  } catch (err) {
    console.error('Error checking DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
