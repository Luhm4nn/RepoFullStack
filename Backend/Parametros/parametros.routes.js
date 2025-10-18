import { Router } from "express";
import {
  getParametros,
  getParametro,
  createParametro,
  deleteParametro,
  updateParametro,
} from "./parametros.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { validateBody } from "../Middlewares/validateRequest.js";
import { parametrosSchema } from "../validations/ParametrosSchema.js";
const router = Router();

router.get("/Parametros", asyncHandler(getParametros));

router.get("/Parametro/:id", asyncHandler(getParametro));

router.post("/Parametro", validateBody(parametrosSchema), asyncHandler(createParametro));

router.put("/Parametro/:id", validateBody(parametrosSchema), asyncHandler(updateParametro));

router.delete("/Parametro/:id", asyncHandler(deleteParametro));

export const parametrosRoutes = router;
