import { Router } from "express";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import {
  getSalas,
  getSala,
  createSala,
  deleteSala,
  updateSala,
  checkNombreSala
} from "./salas.controllers.js";

const router = Router();

router.get("/Salas", asyncHandler(getSalas));

router.get("/Sala/:id", asyncHandler(getSala));

router.get("/Sala/check/:nombreSala", asyncHandler(checkNombreSala));

router.post("/Sala", asyncHandler(createSala));

router.put("/Sala/:id", asyncHandler(updateSala));

router.delete("/Sala/:id", asyncHandler(deleteSala));

export const salasRoutes = router;
