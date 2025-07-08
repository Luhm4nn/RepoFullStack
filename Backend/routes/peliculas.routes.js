import { Router } from "express";
import {
  getPeliculas,
  getPelicula,
  createPelicula,
  deletePelicula,
  updatePelicula,
} from "../Controllers/peliculas.controllers.js";
const router = Router();

router.get("/Peliculas",getPeliculas);

router.get("/Pelicula/:id", getPelicula);

router.post("/Peliculas", createPelicula);

router.put("/Peliculas/:id",updatePelicula);

router.delete("/Pelicula/:id", deletePelicula);

export const peliculasRoutes = router;