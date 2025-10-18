import { Router } from "express";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { validateBody } from "../Middlewares/validateRequest.js";
import { tarifasSchema } from "../../Frontend/src/validations/TarifasSchema.js";
import {
  getTarifas,
  getTarifa,
  createTarifa,
  deleteTarifa,
  updateTarifa,
} from "./tarifas.controllers.js";

const router = Router();

router.get("/Tarifas", asyncHandler(getTarifas));

router.get("/Tarifa/:id", asyncHandler(getTarifa));

router.post("/Tarifa", validateBody(tarifasSchema), asyncHandler(createTarifa));

router.put("/Tarifa/:id", validateBody(tarifasSchema), asyncHandler(updateTarifa));

router.delete("/Tarifa/:id", asyncHandler(deleteTarifa));

export const tarifasRoutes = router;
