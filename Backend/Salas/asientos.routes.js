import { Router } from "express";
import {
  getAsientos,
  getAsiento,
  createAsiento,
  deleteAsiento,
  updateAsiento,
} from "./asientos.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Sala/:idSala/Asientos", asyncHandler(getAsientos));

router.get(
  "/Sala/:idSala/Asientos/:filaAsiento/:nroAsiento",
  asyncHandler(getAsiento)
);

router.post("/Sala/:idSala/Asiento", asyncHandler(createAsiento));

router.put(
  "/Sala/:idSala/Asientos/:filaAsiento/:nroAsiento",
  asyncHandler(updateAsiento)
);

router.delete(
  "/Sala/:idSala/Asientos/:filaAsiento/:nroAsiento",
  asyncHandler(deleteAsiento)
);

export const asientosRoutes = router;
