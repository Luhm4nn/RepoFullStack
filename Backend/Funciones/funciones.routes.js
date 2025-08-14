import { Router } from "express";
import {
  getFunciones,
  getFuncion,
  createFuncion,
  updateFuncion,
  deleteFuncion,
} from "./funciones.controllers.js";

import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Funciones", asyncHandler(getFunciones));

router.get(
  "/Funcion/:idSala/:fechaHoraFuncion",
  asyncHandler(getFuncion)
);

router.post("/Funcion", asyncHandler(createFuncion));

router.put(
  "/Funcion/:idSala/:fechaHoraFuncion",
  asyncHandler(updateFuncion)
);

router.delete(
  "/Funcion/:idSala/:fechaHoraFuncion",
  asyncHandler(deleteFuncion)
);

export const funcionesRoutes = router;
