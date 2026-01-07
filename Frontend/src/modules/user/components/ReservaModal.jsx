import { useState } from "react";
import { Formik, Form, Field } from "formik";
import SeatSelectorReserva from "./SeatSelectorReserva";
import PaymentStep from "./PaymentStep";
import { createReserva } from "../../../api/Reservas.api";
import { createAsientosReservados } from "../../../api/AsientoReservas.api";
import { formatDateTime } from "../../shared";
import { reservaSchema } from "../../../validations/ReservasSchema";
import { CenteredSpinner } from "../../shared/components/Spinner";

function ReservaModal({ funcion, pelicula, onClose, onReservaExitosa }) {
  const [step, setStep] = useState(1); // 1: selección asientos, 2: confirmación, 3: pago, 4: éxito
  const [selectedSeatsData, setSelectedSeatsData] = useState({
    seats: [],
    total: 0,
    count: 0,
  });
  const [confirmedDNI, setConfirmedDNI] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);

  const handleSeatsChange = (seatsData) => {
    setSelectedSeatsData(seatsData);
  };

  const handleContinuar = () => {
    if (selectedSeatsData.count === 0) {
      setError("Debes seleccionar al menos un asiento");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleConfirmarReserva = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Crear la reserva principal
      const fechaHoraReserva = new Date().toISOString();

      const reservaData = {
        idSala: funcion.idSala,
        fechaHoraFuncion: funcion.fechaHoraFuncion,
        DNI: parseInt(values.DNI, 10),
        total: selectedSeatsData.total,
        fechaHoraReserva: fechaHoraReserva,
      };

      const reservaCreada = await createReserva(reservaData);

      // 2. Crear los asientos reservados
      const asientosData = selectedSeatsData.seats.map((seat) => ({
        idSala: funcion.idSala,
        filaAsiento: seat.filaAsiento,
        nroAsiento: seat.nroAsiento,
        fechaHoraFuncion: funcion.fechaHoraFuncion,
        DNI: parseInt(values.DNI, 10),
        fechaHoraReserva: fechaHoraReserva,
      }));

      await createAsientosReservados(asientosData);

      // Guardar DNI para mostrar en step 4
      setConfirmedDNI(values.DNI);

      // 3. Simular pago
      setStep(3);

      // Simular procesamiento de pago
      setTimeout(() => {
        setStep(4);
        setLoading(false);
        setSubmitting(false);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al procesar la reserva. Intenta nuevamente."
      );
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleFinalizar = () => {
    if (onReservaExitosa) {
      onReservaExitosa();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {pelicula.nombrePelicula}
            </h2>
            <p className="text-gray-400">
              {funcion.sala?.nombreSala || `Sala ${funcion.idSala}`} • {fecha} •{" "}
              {hora}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Selección de asientos */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  Selecciona tus asientos en el mapa. Puedes elegir hasta 10
                  asientos por reserva.
                </p>
              </div>

              <SeatSelectorReserva
                idSala={funcion.idSala}
                fechaHoraFuncion={funcion.fechaHoraFuncion}
                onSeatsChange={handleSeatsChange}
                maxSeats={10}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleContinuar}
                  disabled={selectedSeatsData.count === 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmación y datos del usuario */}
          {step === 2 && (
            <Formik
              initialValues={{
                DNI: "",
                selectedSeats: selectedSeatsData.seats,
              }}
              validationSchema={reservaSchema}
              onSubmit={handleConfirmarReserva}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Confirma tu reserva
                    </h3>

                    {/* Resumen de asientos */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-3">
                        Asientos seleccionados:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedSeatsData.seats.map((seat, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-700 rounded px-3 py-2"
                          >
                            <span className="text-gray-300">
                              Fila {seat.filaAsiento} - Asiento{" "}
                              {seat.nroAsiento}
                            </span>
                            <span className="text-purple-400 ml-2">
                              ${seat.tarifa?.precio || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-600 flex justify-between items-center">
                        <span className="text-white font-semibold text-lg">
                          Total:
                        </span>
                        <span className="text-green-400 font-bold text-2xl">
                          ${selectedSeatsData.total}
                        </span>
                      </div>
                    </div>

                    {/* Formulario DNI */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <label
                        htmlFor="DNI"
                        className="block text-white font-semibold mb-2"
                      >
                        DNI del titular de la reserva:
                      </label>
                      <Field
                        id="DNI"
                        name="DNI"
                        type="text"
                        placeholder="Ingresa tu DNI"
                        maxLength={8}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          errors.DNI && touched.DNI
                            ? "bg-slate-700 border-red-500 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            : "bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        }`}
                      />
                      {errors.DNI && touched.DNI ? (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.DNI}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm mt-2">
                          Solo números, sin puntos ni espacios
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                      disabled={isSubmitting || loading}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading || isSubmitting
                        ? "Procesando..."
                        : "Confirmar y Pagar"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {/* Step 3: Procesando pago */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12">
              <CenteredSpinner size="lg" />
              <h3 className="text-2xl font-bold text-white mb-2 mt-6">
                Procesando pago...
              </h3>
              <p className="text-gray-400">Por favor espera un momento</p>
            </div>
          )}

          {/* Step 4: Éxito */}
          {step === 4 && (
            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  ¡Reserva exitosa!
                </h3>
                <p className="text-gray-400 text-center mb-6">
                  Tu reserva ha sido confirmada correctamente
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
                <h4 className="text-white font-semibold text-lg border-b border-slate-700 pb-2">
                  Detalles de tu reserva
                </h4>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-400">Película:</span>{" "}
                    <span className="text-white font-semibold">
                      {pelicula.nombrePelicula}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Fecha:</span> {fecha}
                  </p>
                  <p>
                    <span className="text-gray-400">Hora:</span> {hora}
                  </p>
                  <p>
                    <span className="text-gray-400">Sala:</span>{" "}
                    {funcion.sala?.nombreSala || `Sala ${funcion.idSala}`}
                  </p>
                  <p>
                    <span className="text-gray-400">Asientos:</span>{" "}
                    {selectedSeatsData.count}
                  </p>
                  <p>
                    <span className="text-gray-400">DNI:</span> {confirmedDNI}
                  </p>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-lg">
                      <span className="text-gray-400">Total pagado:</span>
                      <span className="text-green-400 font-bold ml-2">
                        ${selectedSeatsData.total}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm text-center">
                  Recuerda llegar 15 minutos antes de la función. Presenta tu
                  DNI en la boletería.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleFinalizar}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservaModal;
