import { Router } from "express";
import { peliculasRoutes } from "./Peliculas/peliculas.routes.js";
import { salasRoutes } from "./Salas/salas.routes.js";
import { tarifasRoutes } from "./Tarifas/tarifas.routes.js";
import { parametrosRoutes } from "./Parametros/parametros.routes.js";
import { funcionesRoutes } from "./Funciones/funciones.routes.js";
import { usuariosRoutes } from "./Usuario/usuarios.routes.js";
import { authRoutes } from "./Auth/auth.routes.js";

const router = Router();


router.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});

router.use(peliculasRoutes);
router.use(salasRoutes);
router.use(tarifasRoutes);
router.use(parametrosRoutes);
router.use(funcionesRoutes);
router.use(usuariosRoutes);
router.use(authRoutes);

export const indexRoutes = router;
