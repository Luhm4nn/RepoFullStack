import { Router } from "express";
import {
  getPeliculas,
  getPelicula,
  createPelicula,
  deletePelicula,
  updatePelicula,
} from "./peliculas.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Peliculas", asyncHandler(getPeliculas));

router.get("/Pelicula/:id", asyncHandler(getPelicula));

router.post("/Pelicula", asyncHandler(createPelicula));

router.put("/Pelicula/:id", asyncHandler(updatePelicula));

router.delete("/Pelicula/:id", asyncHandler(deletePelicula));

export const peliculasRoutes = router;
