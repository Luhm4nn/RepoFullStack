import { Router } from "express";
import {
  getFunciones,
  getFuncion,
  createFuncion,
  updateFuncion,
  deleteFuncion,
} from "../Controllers/funcion.controllers.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";
const router = Router();

router.get("/Funciones", asyncHandler(getFunciones));

router.get(
  "/Funciones/:idSala/:fechaFuncion/:horaInicioFuncion",
  asyncHandler(getFuncion)
);

router.post("/Funcion", asyncHandler(createFuncion));

router.put(
  "/Funcion/:idSala/:fechaFuncion/:horaInicioFuncion",
  asyncHandler(updateFuncion)
);

router.delete(
  "/Funcion/:idSala/:fechaFuncion/:horaInicioFuncion",
  asyncHandler(deleteFuncion)
);

export const funcionesRoutes = router;
