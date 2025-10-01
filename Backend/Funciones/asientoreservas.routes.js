import { Router } from "express";
import {
  getAsientoReservas,
  getAsientoReserva,
  createAsientoReserva,
  updateAsientoReserva,
  deleteAsientoReserva,
  getAsientosReservadosByFuncion, 
} from "./asientoreservas.controllers.js";

import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();
router.get("/AsientoReservas", asyncHandler(getAsientoReservas));

router.get(
  "/AsientoReservas/:idSala/:fechaHoraFuncion", 
  asyncHandler(getAsientosReservadosByFuncion)
);

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