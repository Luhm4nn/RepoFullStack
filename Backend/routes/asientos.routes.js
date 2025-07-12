import { Router } from "express";
import {
  getAsientos,
  getAsiento,
  createAsiento,
  deleteAsiento,
  updateAsiento,
} from "../Controllers/asientos.controllers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
const router = Router();

router.get("/Sala/:id/Asientos",asyncHandler(getAsientos));

router.get("/Sala/:id/Asientos/:fila/:nro", asyncHandler(getAsiento));

router.post("/Sala/:id/Asiento", asyncHandler(createAsiento));

router.put("/Sala/:id/Asientos/:fila/:nro", asyncHandler(updateAsiento));

router.delete("/Sala/:id/Asientos/:fila/:nro",  asyncHandler(deleteAsiento));

export const asientosRoutes = router;