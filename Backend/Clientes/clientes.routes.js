import { Router } from "express";
import {
  getClientes,
  getCliente,
  createCliente,
  deleteCliente,
  updateCliente,
} from "./clientes.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Clientes", asyncHandler(getClientes));

router.get("/Cliente/:dni", asyncHandler(getCliente));

router.post("/Cliente", asyncHandler(createCliente));

router.put("/Cliente/:dni", asyncHandler(updateCliente));

router.delete("/Cliente/:dni", asyncHandler(deleteCliente));

export const clientesRoutes = router;
