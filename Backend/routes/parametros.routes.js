import { Router } from "express";
import {
  getParametros,
  getParametro,
  createParametro,
  deleteParametro,
  updateParametro,
}  from "../Controllers/parametros.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Parametros",asyncHandler(getParametros));

router.get("/Parametro/:id", asyncHandler(getParametro));

router.post("/Parametro", asyncHandler(createParametro));

router.put("/Parametro/:id", asyncHandler(updateParametro));

router.delete("/Parametro/:id",  asyncHandler(deleteParametro));

export const parametrosRoutes = router;