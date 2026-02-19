import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { deletePendingReserva } from '../../../api/Reservas.api';
import { useAuth } from '../../../modules/shared/hooks/useAuth.js';

const STORAGE_KEY = 'reserva_step3';
const TIMER_KEY = 'countdown_expiry';

/**
 * Hook para limpiar reservas huerfanas cuando el usuario navega fuera del flujo de reserva
 */
export const useReservaCleanup = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Si todavía estamos cargando el estado inicial de auth, esperamos
    if (loading) return;

    const cleanup = async () => {
      if (!isAuthenticated) return;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const { reservaData } = JSON.parse(saved);

        const isReservaRoute = location.pathname.startsWith('/reservar/');
        const isMPRoute = ['/reserva/success', '/reserva/failure', '/reserva/pending'].includes(
          location.pathname
        );

        if (!isReservaRoute && !isMPRoute) {
          try {
            await deletePendingReserva(
              reservaData.idSala,
              reservaData.fechaHoraFuncion,
              reservaData.DNI,
              reservaData.fechaHoraReserva
            );
          } catch (deleteErr) {
            // Si da 400/404 la reserva ya fue confirmada o no existe — igual limpiamos
          }
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TIMER_KEY);
        }
      } catch (err) {
        // JSON parse u otro error inesperado — limpiamos igual
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMER_KEY);
      }
    };

    cleanup();
  }, [location.pathname, isAuthenticated, loading]);
};
