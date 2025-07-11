import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  getSalas,
  getSala,
  createSala,
  deleteSala,
  updateSala,
} from "../Controllers/salas.controllers.js";

const router = Router();

router.get("/Salas", asyncHandler(getSalas));

router.get("/Sala/:id", asyncHandler(getSala));

router.post("/Sala", asyncHandler(createSala));

router.put("/Sala/:id", asyncHandler(updateSala));

router.delete("/Sala/:id", asyncHandler(deleteSala));

export const salasRoutes = router;
