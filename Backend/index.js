import express from "express";
import { indexRoutes } from "./index.routes.js";
import { peliculasRoutes } from "./Peliculas/peliculas.routes.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import { clientesRoutes } from "./Usuario/usuarios.routes.js";
import { parametrosRoutes } from "./Parametros/parametros.routes.js";
import { salasRoutes } from "./Salas/salas.routes.js";
import { tarifasRoutes } from "./Tarifas/tarifas.routes.js";
import { asientosRoutes } from "./Salas/asientos.routes.js";
import { funcionesRoutes } from "./Funciones/funciones.routes.js";
import { reservasRoutes } from "./Funciones/reservas.routes.js";
import { asientoReservasRoutes } from "./Funciones/asientoreservas.routes.js";
import { iniciarCronFunciones } from "./jobs/funcionesCron.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json());

app.use(indexRoutes);
app.use(peliculasRoutes);
app.use(clientesRoutes);
app.use(parametrosRoutes);
app.use(salasRoutes);
app.use(tarifasRoutes);
app.use(asientosRoutes);
app.use(funcionesRoutes);
app.use(reservasRoutes);
app.use(asientoReservasRoutes);


app.use(errorHandler);


iniciarCronFunciones();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
