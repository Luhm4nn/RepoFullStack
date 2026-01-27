import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFuncionesPorPeliculaYFecha } from '../../../api/Funciones.api';
import { getPelicula } from '../../../api/Peliculas.api';
import { formatDateTime } from '../../shared';
import SeatSelectorReserva from '../components/SeatSelectorReserva';
import PaymentStep from '../components/PaymentStep';
import { authAPI } from '../../../api/login.api';
import SeleccionFuncion from '../components/SeleccionFuncion';
import { CenteredSpinner } from '../../shared/components/Spinner';
import { createReserva, deletePendingReserva } from '../../../api/Reservas.api';
import { getTiempoLimiteReserva } from '../../../api/Parametros.api';
import { useNotification } from '../../../context/NotificationContext';

const STORAGE_KEY = 'reserva_step3';
const TIMER_KEY = 'countdown_expiry';

function ReservaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const notify = useNotification();

  const [pelicula, setPelicula] = useState(null);
  const [fecha, setFecha] = useState('');
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPelicula, setLoadingPelicula] = useState(true);

  // Estados del flujo de reserva
  const [step, setStep] = useState(1); // 1: función, 2: asientos, 3: pago
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState({
    seats: [],
    total: 0,
    count: 0,
  });
  const [userDNI, setUserDNI] = useState(null);
  const [reservaActiva, setReservaActiva] = useState(null);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [refreshSeatsNum, setRefreshSeatsNum] = useState(0);

  // Recuperación de estado persistente (Paso de Pago)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const expiry = localStorage.getItem(TIMER_KEY);

    if (saved && expiry) {
      try {
        const { step: savedStep, funcion, seatsInfo, reservaData } = JSON.parse(saved);
        const expiryTime = parseInt(expiry, 10);

        if (Date.now() < expiryTime && savedStep === 3) {
          setStep(3);
          setSelectedFuncion(funcion);
          setSelectedSeatsInfo(seatsInfo);
          setReservaActiva(reservaData);
          setExpiryTimestamp(expiryTime);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TIMER_KEY);
        }
      } catch (err) {
        // Error de parseo, limpiar storage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMER_KEY);
      }
    }
  }, []);

  // Inicialización: Cargar película y datos del usuario
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingPelicula(true);
      try {
        const [movieData, authData] = await Promise.all([getPelicula(id), authAPI.checkAuth()]);

        setPelicula(movieData);
        if (authData.user) {
          setUserDNI(authData.user.DNI);
        }
      } catch (err) {
        setError('Error al cargar la información inicial.');
      } finally {
        setLoadingPelicula(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setFunciones([]);
    setSelectedFuncion(null);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
    setStep(1);
  };

  const handleBuscar = async () => {
    if (!fecha || !pelicula?.idPelicula) {
      setError('Selecciona una fecha para ver las funciones disponibles.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getFuncionesPorPeliculaYFecha(pelicula.idPelicula, fecha);
      const funcionesArray = Array.isArray(data) ? data : [];
      setFunciones(funcionesArray);
      if (funcionesArray.length === 0) {
        setError('No hay funciones disponibles para la fecha seleccionada.');
      }
    } catch (err) {
      console.error('Error al obtener funciones:', err);
      setFunciones([]);
      setError('Error al obtener funciones para la fecha seleccionada.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFuncion = (funcion) => {
    setSelectedFuncion(funcion);
    setStep(2);
  };

  const handleSeatsChange = useCallback((info) => {
    setSelectedSeatsInfo(info);
  }, []);

  const handleProcederAlPago = async () => {
    if (selectedSeatsInfo.count === 0) {
      notify.warning('Selecciona al menos un asiento.');
      return;
    }

    if (!userDNI) {
      notify.error('Acceso denegado: Inicia sesión para completar la reserva.');
      navigate('/login', { state: { from: `/reserva/${id}` } });
      return;
    }

    setLoading(true);
    try {
      const fechaHoraReserva = new Date().toISOString();

      // Datos de la reserva para el envío atómico
      const reservaPayload = {
        idSala: selectedFuncion.idSala,
        fechaHoraFuncion: selectedFuncion.fechaHoraFuncion,
        DNI: userDNI,
        total: selectedSeatsInfo.total,
        fechaHoraReserva,
      };

      // 1. Crear Reserva y Bloquear Asientos en un solo paso (Atómico)
      const createdReserva = await createReserva(reservaPayload, selectedSeatsInfo.seats);

      // 2. Configurar Timer y Almacenamiento
      const paramData = await getTiempoLimiteReserva();
      const limitMinutes = paramData?.tiempoLimiteReserva || 15;
      const expiry = Date.now() + limitMinutes * 60 * 1000;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step: 3,
          idSala: createdReserva.idSala,
          fechaHoraFuncion: createdReserva.fechaHoraFuncion,
          DNI: createdReserva.DNI,
          fechaHoraReserva: createdReserva.fechaHoraReserva,
          // Guardamos el objeto completo para reconstruir la UI
          funcion: selectedFuncion,
          seatsInfo: selectedSeatsInfo,
          reservaData: createdReserva,
        })
      );
      localStorage.setItem(TIMER_KEY, expiry.toString());

      setReservaActiva(createdReserva);
      setExpiryTimestamp(expiry);
      setStep(3);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Error al procesar la reserva. Intenta de nuevo.';
      notify.error(msg);
      // Forzar recarga de asientos por si fue un error de disponibilidad
      setRefreshSeatsNum((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarReservaPendiente = async () => {
    if (!reservaActiva) return;

    try {
      await deletePendingReserva(
        reservaActiva.idSala,
        reservaActiva.fechaHoraFuncion,
        reservaActiva.DNI,
        reservaActiva.fechaHoraReserva
      );
    } catch (err) {
      // Error silencioso en limpieza
    } finally {
      setReservaActiva(null);
      setExpiryTimestamp(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TIMER_KEY);
    }
  };

  const handleBackToSeats = async () => {
    setLoading(true);
    await handleLimpiarReservaPendiente();
    setRefreshSeatsNum((prev) => prev + 1);
    setStep(2);
    setLoading(false);
  };

  const handleBackToFunctions = async () => {
    setLoading(true);
    await handleLimpiarReservaPendiente();
    setSelectedFuncion(null);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
    setStep(1);
    setLoading(false);
  };

  const handlePaymentSuccess = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMER_KEY);
    setReservaActiva(null);
    setExpiryTimestamp(null);
    notify.success('¡Pago exitoso! Disfruta la función.');
    navigate('/mis-reservas');
  };

  if (loadingPelicula) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <CenteredSpinner size="lg" message="Cargando detalles..." />
      </div>
    );
  }

  if (!pelicula) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Película no disponible</h2>
        <button onClick={() => navigate('/')} className="text-purple-400 underline">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Cartelera
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <img
              src={pelicula.portada || '/placeholder.svg'}
              alt={pelicula.nombrePelicula}
              className="w-full rounded-lg shadow-2xl border border-white/10"
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
                {pelicula.nombrePelicula}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="bg-purple-600/30 text-purple-200 border border-purple-500/50 rounded-full px-4 py-1">
                  {pelicula.MPAA}
                </span>
                <span className="text-gray-300">{pelicula.generoPelicula}</span>
                <span className="flex items-center gap-2 text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                  </svg>
                  {pelicula.duracion} min
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl italic">
              "{pelicula.sinopsis}"
            </p>

            <div className="pt-4">
              <span className="text-gray-400 block mb-1">Director</span>
              <span className="text-white text-xl font-semibold">{pelicula.director}</span>
            </div>

            <div className="flex gap-4">
              {pelicula.trailerURL && (
                <button
                  onClick={() => window.open(pelicula.trailerURL, '_blank')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ver Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          id="funciones"
          className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-white text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-purple-500 rounded-full" />
            Entradas y Horarios
          </h2>

          {step === 1 && (
            <SeleccionFuncion
              idPelicula={pelicula.idPelicula}
              onSelectFuncion={handleSelectFuncion}
            />
          )}

          {step === 2 && selectedFuncion && (
            <div className="animate-in fade-in duration-500">
              <button
                onClick={handleBackToFunctions}
                className="mb-8 flex items-center text-purple-300 hover:text-white transition-colors font-medium"
              >
                ← Volver a Horarios
              </button>

              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Sala: {selectedFuncion.sala?.nombreSala || `Sala ${selectedFuncion.idSala}`} |
                Horario: {formatDateTime(selectedFuncion.fechaHoraFuncion).hora}
              </h3>

              <SeatSelectorReserva
                key={`${selectedFuncion.idSala}-${selectedFuncion.fechaHoraFuncion}-${refreshSeatsNum}`}
                idSala={selectedFuncion.idSala}
                fechaHoraFuncion={selectedFuncion.fechaHoraFuncion}
                onSeatsChange={handleSeatsChange}
              />

              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 w-full max-w-xs text-center shadow-inner">
                  <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-[0.2em] font-bold">
                    Total a pagar
                  </p>
                  <span className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                    ${selectedSeatsInfo.total}
                  </span>
                </div>
                <button
                  onClick={handleProcederAlPago}
                  disabled={selectedSeatsInfo.count === 0 || loading}
                  className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-xl disabled:opacity-40 transition-all active:scale-95 group flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirmar selección</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedFuncion && userDNI && (
            <PaymentStep
              reservaData={reservaActiva}
              selectedSeatsData={selectedSeatsInfo}
              funcion={selectedFuncion}
              pelicula={pelicula}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBackToSeats}
              expiryTimestamp={expiryTimestamp}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservaPage;
