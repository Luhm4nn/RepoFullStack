import cron from "node-cron";
import prisma from "../prisma/prisma.js";

export const iniciarCronFunciones = () => {
  // Corre cada 1 minuto para verificar funciones finalizadas
  cron.schedule("*/1 * * * *", async () => {
    try {
      const ahora = new Date();
      console.log(`[${ahora.toISOString()}] Verificando funciones finalizadas...`);

      const funciones = await prisma.funcion.findMany({
        where: { 
          estado: { not: "Inactiva" }
        },
        include: {
          pelicula: true 
        }
      });

      let funcionesActualizadas = 0;

      for (const funcion of funciones) {
        const fechaFin = new Date(
          funcion.fechaHoraFuncion.getTime() + (funcion.pelicula.duracion * 60000)
        );

        if (ahora > fechaFin) {
          await prisma.funcion.update({
            where: {
              idSala_fechaHoraFuncion: {
                idSala: funcion.idSala,
                fechaHoraFuncion: funcion.fechaHoraFuncion
              }
            },
            data: { estado: "Inactiva" }
          });
          
          funcionesActualizadas++;
          console.log(`✅ Función finalizada: ${funcion.pelicula.nombrePelicula} - Sala ${funcion.idSala} - ${funcion.fechaHoraFuncion.toLocaleString()}`);
        }
      }

      if (funcionesActualizadas > 0) {
        console.log(`🎬 ${funcionesActualizadas} función(es) marcada(s) como Inactiva`);
      }
      
    } catch (error) {
      console.error("❌ Error en cron de funciones:", error);
    }
  });
  
  console.log("⏰ Cron job de funciones iniciado - se ejecuta cada 5 minutos");
};
