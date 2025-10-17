import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createPaymentPreference } from "../../../api/MercadoPago.api";

// Inicializar MercadoPago con tu public key
const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(MERCADOPAGO_PUBLIC_KEY);

function PaymentStep({ 
  reservaData, 
  selectedSeatsData, 
  funcion, 
  pelicula,
  onPaymentSuccess,
  onBack 
}) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    createPreference();
  }, []);

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
          fechaHoraReserva: reservaData.fechaHoraReserva
        },
        asientos: selectedSeatsData.seats.map(s => ({
          filaAsiento: s.filaAsiento,
          nroAsiento: s.nroAsiento,
          precio: s.tarifa?.precio || 0
        }))
      };

      const response = await createPaymentPreference(paymentData);
      setPreferenceId(response.id);
    } catch (err) {
      console.error("Error creating preference:", err);
      setError("Error al iniciar el pago. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const fecha = date.toLocaleDateString('es-AR');
    const hora = date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return { fecha, hora };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
        <h3 className="text-2xl font-bold text-white mb-2">Preparando pago...</h3>
        <p className="text-gray-400">Estamos configurando tu método de pago</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-red-400 mb-2">{error}</h3>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
          >
            Volver
          </button>
          <button
            onClick={createPreference}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de la compra */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Resumen de tu compra</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-300">
            <span>Película:</span>
            <span className="text-white font-semibold">{pelicula.nombrePelicula}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Fecha y hora:</span>
            <span className="text-white font-semibold">
              {formatDateTime(funcion.fechaHoraFuncion).fecha} - {formatDateTime(funcion.fechaHoraFuncion).hora}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Sala:</span>
            <span className="text-white font-semibold">
              {funcion.sala?.nombreSala || `Sala ${funcion.idSala}`}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Asientos:</span>
            <span className="text-white font-semibold">
              {selectedSeatsData.seats.map(s => `${s.filaAsiento}${s.nroAsiento}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Cantidad:</span>
            <span className="text-white font-semibold">{selectedSeatsData.count} asientos</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">Total:</span>
            <span className="text-3xl font-bold text-green-400">
              ${selectedSeatsData.total}
            </span>
          </div>
        </div>
      </div>

      {/* Info sobre MercadoPago */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-blue-300 font-semibold mb-1">Pago seguro con MercadoPago</p>
            <p className="text-blue-200 text-sm">
              Tus datos están protegidos. Puedes pagar con tarjeta de crédito, débito o efectivo.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de pago de MercadoPago */}
      {preferenceId && (
        <div className="flex flex-col items-center gap-4">
          <Wallet 
            initialization={{ preferenceId: preferenceId }}
            customization={{
              texts: {
                valueProp: 'smart_option',
              },
            }}
          />
          
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Volver a editar la reserva
          </button>
        </div>
      )}

      {/* Términos y condiciones */}
      <div className="text-center text-xs text-gray-400">
        <p>
          Al completar el pago, aceptas nuestros{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Términos y Condiciones
          </a>
          {' '}y{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Política de Cancelación
          </a>
        </p>
      </div>
    </div>
  );
}

export default PaymentStep;