import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getReserva } from '../../../api/Reservas.api';

const POLL_INTERVAL = 3000; // 3 segundos
const POLL_TIMEOUT = 30000; // 30 segundos máximo

function ReservaSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  const [status, setStatus] = useState('loading'); // loading | confirmed | failed
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const params = JSON.parse(localStorage.getItem('mp_pending_reserva') || 'null');

    if (!params) {
      // Sin params no podemos verificar, asumimos ok
      setStatus('confirmed');
      return;
    }

    const checkReserva = async () => {
      try {
        const reserva = await getReserva(
          params.idSala,
          params.fechaHoraFuncion,
          params.DNI,
          params.fechaHoraReserva
        );
        if (reserva?.estado === 'ACTIVA') {
          cleanup();
          localStorage.removeItem('mp_pending_reserva');
          setStatus('confirmed');
        }
        // Si sigue en PENDIENTE, seguimos esperando
      } catch {
        // Error de red, seguimos intentando
      }
    };

    const cleanup = () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };

    // Poll inmediato + cada 3 segundos
    checkReserva();
    intervalRef.current = setInterval(checkReserva, POLL_INTERVAL);

    // Timeout máximo: si en 30s no se confirma, mostramos error
    timeoutRef.current = setTimeout(() => {
      cleanup();
      setStatus('failed');
    }, POLL_TIMEOUT);

    return cleanup;
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Confirmando tu reserva...</h1>
            <p className="text-gray-400 text-center">
              Estamos procesando tu pago. Esto puede tardar algunos segundos.
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-full">
              <p className="text-gray-400 text-sm text-center">
                ID de pago: <span className="text-white font-mono">{paymentId || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Pago recibido, reserva en proceso</h1>
            <p className="text-gray-400 text-center">
              Tu pago fue procesado pero la confirmación está tardando más de lo esperado. Revisá tu
              email en unos minutos o consultá en "Mis Reservas".
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-full">
              <p className="text-gray-400 text-sm text-center">
                ID de pago: <span className="text-white font-mono">{paymentId || 'N/A'}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/mis-reservas')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold"
              >
                Ver mis reservas
              </button>
              <button
                onClick={() => navigate('/cartelera')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
              >
                Volver a Cartelera
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">¡Reserva confirmada!</h1>
          <p className="text-gray-400 text-center">
            Tu reserva fue confirmada exitosamente. Recibirás un email con tu código QR de entrada.
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-full">
            <p className="text-gray-400 text-sm text-center">
              ID de pago: <span className="text-white font-mono">{paymentId || 'N/A'}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/mis-reservas')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold"
            >
              Ver mis reservas
            </button>
            <button
              onClick={() => navigate('/cartelera')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
            >
              Volver a Cartelera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservaSuccessPage;
