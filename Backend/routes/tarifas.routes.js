import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  getTarifas,
  getTarifa,
  createTarifa,
  deleteTarifa,
  updateTarifa,
} from "../Controllers/tarifas.controllers.js";

const router = Router();

router.get("/Tarifas", asyncHandler(getTarifas));

router.get("/Tarifa/:id", asyncHandler(getTarifa));

router.post("/Tarifa", asyncHandler(createTarifa));

router.put("/Tarifa/:id", asyncHandler(updateTarifa));

router.delete("/Tarifa/:id", asyncHandler(deleteTarifa));

export const tarifasRoutes = router;
