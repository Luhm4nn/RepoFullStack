import { Router } from "express";
import {
  getPeliculas,
  getPelicula,
  createPelicula,
  deletePelicula,
  updatePelicula,
} from "./peliculas.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { handleMoviePosterUpload } from "../Middlewares/uploadHandler.js";

const router = Router();

router.get("/Peliculas", asyncHandler(getPeliculas));

router.get("/Pelicula/:id", asyncHandler(getPelicula));

router.post("/Pelicula", handleMoviePosterUpload, asyncHandler(createPelicula));

router.put("/Pelicula/:id", handleMoviePosterUpload, asyncHandler(updatePelicula));

router.delete("/Pelicula/:id", asyncHandler(deletePelicula));

export const peliculasRoutes = router;