import { Router } from "express";
import {
  getReservas,
  getReserva,
  createReserva,
  cancellReserva,
  deleteReserva,
  getLatestReservas
} from "./reservas.controllers.js";

import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/Reservas", asyncHandler(getReservas));

router.get("/Reservas/latest", asyncHandler(getLatestReservas));

router.get(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva",
  asyncHandler(getReserva)
);

router.post("/Reserva", asyncHandler(createReserva));

router.put(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva",
  asyncHandler(cancellReserva)
);

router.delete(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva",
  asyncHandler(deleteReserva)
);


export const reservasRoutes = router;
