import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { deletePendingReserva } from "../../../api/Reservas.api";

const STORAGE_KEY = "reserva_step3";
const TIMER_KEY = "countdown_expiry";

/**
 * Hook para limpiar reservas huerfanas cuando el usuario navega fuera del flujo de reserva
 */
export const useReservaCleanup = () => {
  const location = useLocation();

  useEffect(() => {
    const cleanup = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const { step, reservaData } = JSON.parse(saved);
        
        // Si estamos en el paso de pago (3) pero la ruta NO es la de reserva
        // ni las de éxito/error/pendencia de Mercado Pago, limpiamos.
        const isReservaRoute = location.pathname.startsWith("/reservar/");
        const isMPRoute = ["/reserva/success", "/reserva/failure", "/reserva/pending"].includes(location.pathname);

        if (!isReservaRoute && !isMPRoute) {          
          await deletePendingReserva(
            reservaData.idSala,
            reservaData.fechaHoraFuncion,
            reservaData.DNI,
            reservaData.fechaHoraReserva
          );
          
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TIMER_KEY);
        }
      } catch (err) {
        console.error("Error en useReservaCleanup:", err);
      }
    };

    cleanup();
  }, [location.pathname]);
};
