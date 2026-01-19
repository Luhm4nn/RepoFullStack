import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import SeatSelectorReserva from "./SeatSelectorReserva";
import CountdownTimer from "./CountdownTimer";
import { createReserva, confirmReserva, deletePendingReserva } from "../../../api/Reservas.api";
import { createAsientosReservados } from "../../../api/AsientoReservas.api";
import { getTiempoLimiteReserva } from "../../../api/Parametros.api";
import { formatDateTime } from "../../shared";
import { reservaSchema } from "../../../validations/ReservasSchema";
import { CenteredSpinner } from "../../shared/components/Spinner";
import { useNotification } from "../../../context/NotificationContext";

const RESERVA_STORAGE_KEY = "active_reserva";

function ReservaModal({ funcion, pelicula, onClose, onReservaExitosa }) {
  const [step, setStep] = useState(1); // 1: selección, 2: DNI, 3: pago, 4: éxito
  const [selectedSeatsData, setSelectedSeatsData] = useState({
    seats: [],
    total: 0,
    count: 0,
  });
  const [confirmedDNI, setConfirmedDNI] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservaActiva, setReservaActiva] = useState(null);
  const [tiempoLimite, setTiempoLimite] = useState(15); 
  const notify = useNotification();

  const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const data = await getTiempoLimiteReserva();
        if (data && data.tiempoLimiteReserva) {
          setTiempoLimite(data.tiempoLimiteReserva);
        }
      } catch (err) {
        console.error("Error al cargar parámetros:", err);
      }
    };
    fetchParams();

    // Recuperar reserva del localStorage si existe y coincide con esta función
    const saved = localStorage.getItem(RESERVA_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.idSala === funcion.idSala && data.fechaHoraFuncion === funcion.fechaHoraFuncion) {
        setReservaActiva(data.reservaData);
        setConfirmedDNI(data.reservaData.DNI.toString());
        setSelectedSeatsData(data.selectedSeatsData);
        setStep(3);
      } else {
        // Si hay una reserva de OTRA función, la limpiamos (el backend también lo hará al crear la nueva)
        localStorage.removeItem(RESERVA_STORAGE_KEY);
      }
    }

    // Cleanup al DESMONTAR el componente (Navegación fuera de la página)
    return () => {
      // Si el componente se desmonta y estamos en estado PENDIENTE (step 2 o 3), limpiamos.
      // IMPORTANTE: Esto se ejecutará si el usuario navega a otro componente.
      // Pero no queremos que se borre si el usuario RECARGA la página (localStorage nos salva).
      // handleLimpiarReservaPendiente se encarga de la lógica.
    };
  }, []);

  const handleSeatsChange = (seatsData) => {
    setSelectedSeatsData(seatsData);
  };

  const handleLimpiarReservaPendiente = async () => {
    if (reservaActiva) {
      try {
        await deletePendingReserva(
          reservaActiva.idSala,
          reservaActiva.fechaHoraFuncion,
          reservaActiva.DNI,
          reservaActiva.fechaHoraReserva
        );
      } catch (err) {
        console.error("Error al limpiar reserva:", err);
      } finally {
        setReservaActiva(null);
        localStorage.removeItem(RESERVA_STORAGE_KEY);
      }
    }
  };

  const handleClose = async () => {
    if (step === 2 || step === 3) {
      setLoading(true);
      await handleLimpiarReservaPendiente();
    }
    onClose();
  };

  const handleBackToStep1 = async () => {
    setLoading(true);
    await handleLimpiarReservaPendiente();
    setStep(1);
    setLoading(false);
  };

  const handleTimerExpire = async () => {
    notify.error("El tiempo de reserva ha expirado");
    await handleLimpiarReservaPendiente();
    setStep(1);
    setError("Tu sesión ha expirado. Por favor, selecciona los asientos nuevamente.");
  };

  const handleContinuar = async () => {
    if (selectedSeatsData.count === 0) {
      setError("Debes seleccionar al menos un asiento");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleCrearReservaPendiente = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const fechaHoraReserva = new Date().toISOString();
      const DNI = parseInt(values.DNI, 10);

      const reservaData = {
        idSala: funcion.idSala,
        fechaHoraFuncion: funcion.fechaHoraFuncion,
        DNI: DNI,
        total: selectedSeatsData.total,
        fechaHoraReserva: fechaHoraReserva,
      };

      await createReserva(reservaData);

      const asientosData = selectedSeatsData.seats.map((seat) => ({
        idSala: funcion.idSala,
        filaAsiento: seat.filaAsiento,
        nroAsiento: seat.nroAsiento,
        fechaHoraFuncion: funcion.fechaHoraFuncion,
        DNI: DNI,
        fechaHoraReserva: fechaHoraReserva,
      }));

      await createAsientosReservados(asientosData);

      const fullData = {
        idSala: funcion.idSala,
        fechaHoraFuncion: funcion.fechaHoraFuncion,
        reservaData: { ...reservaData },
        selectedSeatsData: { ...selectedSeatsData }
      };

      localStorage.setItem(RESERVA_STORAGE_KEY, JSON.stringify(fullData));
      setReservaActiva({ ...reservaData });
      setConfirmedDNI(values.DNI);
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al bloquear los asientos. Posiblemente alguien los ocupó justo ahora.";
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarReserva = async () => {
    if (!reservaActiva) return;
    setLoading(true);
    setError(null);
    try {
      await confirmReserva(
        reservaActiva.idSala,
        reservaActiva.fechaHoraFuncion,
        reservaActiva.DNI,
        reservaActiva.fechaHoraReserva
      );
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al procesar el pago.";
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = () => {
    if (onReservaExitosa) onReservaExitosa();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">
              {pelicula.nombrePelicula}
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {funcion.sala?.nombreSala || `Sala ${funcion.idSala}`} • {fecha} • {hora}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {(step === 3) && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Bloqueo expira en</span>
                <CountdownTimer 
                  initialSeconds={tiempoLimite * 60} 
                  onExpire={handleTimerExpire}
                  className="!text-xl !py-1 !px-4"
                />
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <SeatSelectorReserva
                idSala={funcion.idSala}
                fechaHoraFuncion={funcion.fechaHoraFuncion}
                onSeatsChange={handleSeatsChange}
                maxSeats={10}
              />
              {error && <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400 text-sm">{error}</div>}
              <div className="flex justify-end gap-4 mt-8">
                <button onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-all">Cancelar</button>
                <button
                  onClick={handleContinuar}
                  disabled={selectedSeatsData.count === 0}
                  className="px-10 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-black shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all uppercase tracking-tighter"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <Formik
              initialValues={{ DNI: confirmedDNI || "" }}
              validationSchema={reservaSchema}
              onSubmit={handleCrearReservaPendiente}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="max-w-md mx-auto py-10">
                  <h3 className="text-2xl font-black text-white mb-6 text-center tracking-tight">Identificación del Titular</h3>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6 shadow-2xl">
                    <div>
                      <label htmlFor="DNI" className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-3">DNI para la reserva</label>
                      <Field
                        id="DNI" name="DNI" type="text" maxLength={8}
                        className={`w-full px-5 py-4 rounded-xl bg-slate-900 border-2 transition-all font-mono text-xl ${
                          errors.DNI && touched.DNI ? "border-red-500 text-red-400" : "border-slate-700 text-white focus:border-purple-500"
                        }`}
                      />
                      {errors.DNI && touched.DNI && <p className="text-red-500 text-xs mt-2 font-bold">{errors.DNI}</p>}
                    </div>
                    <button
                      type="submit" disabled={isSubmitting || loading}
                      className="w-full py-4 bg-white text-black rounded-xl font-black text-lg hover:bg-gray-200 transition-all shadow-xl disabled:opacity-50"
                    >
                      {loading ? <CenteredSpinner size="sm" /> : "BLOQUEAR Y PAGAR"}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 hover:text-gray-300 text-sm font-bold uppercase tracking-widest">Atrás</button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {step === 3 && (
            <div className="max-w-4xl mx-auto py-4">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">1</span>
                    Resumen
                  </h3>
                  <div className="bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-end border-b border-slate-700/50 pb-4">
                      <span className="text-gray-500 text-xs uppercase font-black">Total a Abonar</span>
                      <span className="text-4xl font-black text-green-400 tracking-tighter">${selectedSeatsData.total}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-500 text-[10px] uppercase font-black">Asientos Reservados</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeatsData.seats.map((seat, idx) => (
                          <span key={idx} className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-lg font-black text-sm">
                            F{seat.filaAsiento} - A{seat.nroAsiento}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleBackToStep1} className="flex items-center gap-2 text-red-500/70 hover:text-red-500 text-[10px] uppercase font-black transition-all">
                    Abandonar reserva y liberar asientos
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">2</span>
                    Pago
                  </h3>
                  <div className="bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Simulación de Checkout</p>
                      <p className="text-gray-500 text-sm mt-1">Haga clic abajo para finalizar su compra de forma segura.</p>
                    </div>
                    <button
                      onClick={handleConfirmarReserva}
                      disabled={loading}
                      className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-xl hover:scale-[1.02] shadow-2xl shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? <CenteredSpinner size="sm" /> : "PAGAR AHORA"}
                    </button>
                  </div>
                </div>
              </div>
              {error && <div className="mt-6 bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400 text-sm text-center font-bold animate-shake">{error}</div>}
            </div>
          )}

          {step === 4 && (
            <div className="py-10 text-center space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/30">
                <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="text-5xl font-black text-white tracking-tighter">¡COMPRA EXITOSA!</h3>
                <p className="text-gray-400 mt-2 font-medium">Se han enviado los detalles a tu email.</p>
              </div>
              <div className="max-w-md mx-auto bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold uppercase">Película</span><span className="text-white font-black">{pelicula.nombrePelicula}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold uppercase">Titular DNI</span><span className="text-white font-black">{confirmedDNI}</span></div>
                <div className="flex justify-between text-base pt-4 border-t border-slate-700"><span className="text-white font-black uppercase">Total Pagado</span><span className="text-green-400 font-black text-2xl">${selectedSeatsData.total}</span></div>
              </div>
              <button onClick={handleFinalizar} className="px-12 py-4 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all active:scale-95">FINALIZAR</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservaModal;
