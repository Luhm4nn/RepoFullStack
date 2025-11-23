import { Router } from "express";
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  deleteUsuario,
  updateUsuario,
} from "./usuarios.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { registerLimiter } from "../Middlewares/rateLimiter.js";
const router = Router();

router.get("/Usuarios", asyncHandler(getUsuarios));

router.get("/Usuario/:dni", asyncHandler(getUsuario));

router.post("/Usuario", registerLimiter, asyncHandler(createUsuario));

router.put("/Usuario/:dni", asyncHandler(updateUsuario));

router.delete("/Usuario/:dni", asyncHandler(deleteUsuario));

export const usuariosRoutes = router;
