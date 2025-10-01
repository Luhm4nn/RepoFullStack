import { Router } from "express";
import {
  getPeliculas,
  getPelicula,
  createPelicula,
  deletePelicula,
  updatePelicula,
  getPeliculasEnCartelera,
} from "./peliculas.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { handleMoviePosterUpload } from "../Middlewares/uploadHandler.js";
import { validateBody } from "../Middlewares/validateRequest.js";
import { peliculaSchema } from "../validations/PeliculasSchema.js";

const router = Router();

router.get("/Peliculas", asyncHandler(getPeliculas));

router.get("/Pelicula/:id", asyncHandler(getPelicula));

router.post("/Pelicula", validateBody(peliculaSchema), handleMoviePosterUpload, asyncHandler(createPelicula));

router.put("/Pelicula/:id", validateBody(peliculaSchema), handleMoviePosterUpload, asyncHandler(updatePelicula));

router.delete("/Pelicula/:id", asyncHandler(deletePelicula));

router.get("/Peliculas/cartelera", asyncHandler(getPeliculasEnCartelera));

export const peliculasRoutes = router;