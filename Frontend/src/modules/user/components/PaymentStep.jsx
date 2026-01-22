import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createPaymentPreference } from '../../../api/MercadoPago.api';
import { CenteredSpinner } from '../../shared/components/Spinner';
import CountdownTimer from './CountdownTimer';
import { getTiempoLimiteReserva } from '../../../api/Parametros.api';

// Inicializar MercadoPago con tu public key
const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(MERCADOPAGO_PUBLIC_KEY);

function PaymentStep({
  reservaData,
  selectedSeatsData,
  funcion,
  pelicula,
  onPaymentSuccess,
  onBack,
  expiryTimestamp,
}) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expired, setExpired] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  useEffect(() => {
    createPreference();

    // Sincronizar el timer con el timestamp de expiración centralizado
    if (expiryTimestamp) {
      const seconds = Math.floor((expiryTimestamp - Date.now()) / 1000);
      setRemainingSeconds(seconds > 0 ? seconds : 0);
    } else {
      // Fallback a tiempo por defecto desde parámetros si no hay timestamp
      const fetchTiempo = async () => {
        try {
          const data = await getTiempoLimiteReserva();
          setRemainingSeconds(data.tiempoLimiteReserva * 60);
        } catch (err) {
          setRemainingSeconds(900); // 15 min fallback
        }
      };
      fetchTiempo();
    }
  }, [expiryTimestamp]);

  const createPreference = async () => {
    setLoading(true);
    setError(null);
    try {
      const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);
      const paymentData = {
        reserva: {
          nombrePelicula: pelicula.nombrePelicula,
          fecha: fecha,
          hora: hora,
          sala: funcion.sala?.nombreSala || `Sala ${funcion.idSala}`,
          total: selectedSeatsData.total,
          idSala: funcion.idSala,
          fechaHoraFuncion: funcion.fechaHoraFuncion,
          DNI: reservaData.DNI,
          fechaHoraReserva: reservaData.fechaHoraReserva,
        },
        asientos: selectedSeatsData.seats.map((s) => ({
          filaAsiento: s.filaAsiento,
          nroAsiento: s.nroAsiento,
          precio: s.tarifa?.precio || 0,
        })),
      };

      const response = await createPaymentPreference(paymentData);
      setPreferenceId(response.id);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al conectar con Mercado Pago.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      fecha: date.toLocaleDateString('es-AR'),
      hora: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading || !reservaData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-pulse">
        <CenteredSpinner size="lg" message="Preparando pasarela de pago..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
          <p className="text-gray-400">Si el problema persiste, intenta reiniciar tu reserva.</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
          >
            Volver
          </button>
          {!expired && (
            <button
              onClick={createPreference}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Resumen */}
      <div className="space-y-4">
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
            Resumen de Compra
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-gray-400">Película</span>
              <span className="text-white font-medium text-sm md:text-base">
                {pelicula.nombrePelicula}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-gray-400">Función</span>
              <span className="text-white font-medium text-sm md:text-base">
                {formatDateTime(funcion.fechaHoraFuncion).fecha} -{' '}
                {formatDateTime(funcion.fechaHoraFuncion).hora}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-gray-400">Asientos</span>
              <span className="text-white font-medium text-sm md:text-base">
                {selectedSeatsData.seats.map((s) => `${s.filaAsiento}${s.nroAsiento}`).join(', ')}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 md:pt-6 border-t border-white/10 flex justify-between items-end">
            <span className="text-gray-400 font-medium text-sm">Monto Total</span>
            <span className="text-2xl md:text-4xl font-black text-green-400">
              ${selectedSeatsData.total}
            </span>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
          <svg
            className="w-6 h-6 text-blue-400 mt-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-blue-200 text-sm leading-snug">
            Tu pago es procesado de forma segura por <strong>Mercado Pago</strong>. Aceptamos todas
            las tarjetas y medios electrónicos.
          </p>
        </div>
      </div>

      {/* Pago */}
      <div className="flex flex-col justify-center items-center bg-white/5 rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="text-center space-y-3 mb-8 w-full">
          <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-bold">
            Tiempo para pagar
          </p>
          <div className="inline-block transform transition-transform hover:scale-105 duration-300">
            <CountdownTimer
              initialSeconds={remainingSeconds || 900}
              onExpire={() => {
                setExpired(true);
                setError('Tu reserva ha expirado por tiempo excedido.');
                setTimeout(() => onBack(), 2500);
              }}
            />
          </div>
        </div>

        {!expired && preferenceId && (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[180px] sm:max-w-[320px] mx-auto transform -translate-x-9 sm:translate-x-0 transition-all hover:brightness-110">
                <Wallet
                  initialization={{ preferenceId: preferenceId }}
                  customization={{
                    texts: { valueProp: 'smart_option' },
                    visual: {
                      buttonBackground: 'default',
                      borderRadius: '9999px',
                    },
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <a
                href={`https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${preferenceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-400 text-[11px] transition-colors flex items-center gap-2 justify-center mt-2"
              >
                <span>¿Deseas pagar en una pestaña aparte?</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="mt-12 text-gray-500 hover:text-red-400 transition-colors text-sm font-medium border-b border-transparent hover:border-red-400/30 pb-1"
        >
          ← Cancelar y elegir otros asientos
        </button>
      </div>
    </div>
  );
}

export default PaymentStep;
