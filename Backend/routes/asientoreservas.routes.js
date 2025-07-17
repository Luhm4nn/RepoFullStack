import { Router } from "express";
import {
  getAsientoReservas,
  getAsientoReserva,
  createAsientoReserva,
  updateAsientoReserva,
  deleteAsientoReserva,
} from "../Controllers/asientoreservas.controllers.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";
const router = Router();

router.get("/AsientoReservas", asyncHandler(getAsientoReservas));

router.get(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento",
  asyncHandler(getAsientoReserva)
);

router.post("/AsientoReserva", asyncHandler(createAsientoReserva));

router.put(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento",
  asyncHandler(updateAsientoReserva)
);

router.delete(
  "/Reserva/:idSala/:fechaHoraFuncion/:DNI/:fechaHoraReserva/Asiento/:filaAsiento/:nroAsiento",
  asyncHandler(deleteAsientoReserva)
);

export const asientoReservasRoutes = router;
