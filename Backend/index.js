import express from "express";
import { indexRoutes } from "./routes/index.routes.js";
import { peliculasRoutes } from "./routes/peliculas.routes.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import { clientesRoutes } from "./routes/clientes.routes.js";
import { parametrosRoutes } from "./routes/parametros.routes.js";
import { salasRoutes } from "./routes/salas.routes.js";
import { tarifasRoutes } from "./routes/tarifas.routes.js";
import { asientosRoutes } from "./routes/asientos.routes.js";
import { funcionesRoutes } from "./routes/funciones.routes.js";
import { reservasRoutes } from "./routes/reservas.routes.js";
import { asientoReservasRoutes } from "./routes/asientoreservas.routes.js";

const app = express();
const PORT = 4000;

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
