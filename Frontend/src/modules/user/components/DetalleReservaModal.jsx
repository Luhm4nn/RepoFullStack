import { useState, useEffect } from "react";
import { getAsientosReservadosPorFuncion } from "../../../api/AsientoReservas.api";
import { formatDateTime } from "../../shared/utils/dateFormater";

function DetalleReservaModal({ reserva, onClose, onCancelar }) {
  const [asientos, setAsientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fecha, hora } = formatDateTime(reserva.fechaHoraFuncion);
  const { fecha: fechaReserva } = formatDateTime(reserva.fechaHoraReserva);
  const pelicula = reserva.funcion?.pelicula;
  const sala = reserva.funcion?.sala;

  useEffect(() => {
    const cargarAsientos = async () => {
      setLoading(true);
      setError(null);
      try {
        const todosAsientos = await getAsientosReservadosPorFuncion(
          reserva.idSala,
          reserva.fechaHoraFuncion
        );

        // Filtrar solo los asientos de esta reserva específica
        const fechaReservaBase = new Date(reserva.fechaHoraReserva);
        fechaReservaBase.setMilliseconds(0);

        const asientosReserva = todosAsientos.filter((a) => {
          const fechaAsiento = new Date(a.fechaHoraReserva);
          fechaAsiento.setMilliseconds(0);

          return (
            a.DNI === reserva.DNI &&
            fechaAsiento.getTime() === fechaReservaBase.getTime()
          );
        });

        setAsientos(asientosReserva);
      } catch (err) {
        setError("No se pudieron cargar los asientos");
      } finally {
        setLoading(false);
      }
    };

    cargarAsientos();
  }, [reserva]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="border-b border-slate-700 p-4 sm:p-6 flex justify-between items-start flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
              Detalles de Reserva
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Información completa de tu reserva
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
          {/* Película */}
          <div className="flex gap-6 mb-6">
            <img
              src={pelicula?.portada || "/placeholder.svg"}
              alt={pelicula?.nombrePelicula}
              className="w-32 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {pelicula?.nombrePelicula || "Película"}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                  {pelicula?.MPAA}
                </span>
                <span className="text-gray-400 text-sm">
                  {pelicula?.generoPelicula}
                </span>
                <span className="text-gray-400 text-sm">
                  • {pelicula?.duracion} min
                </span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-3">
                {pelicula?.sinopsis}
              </p>
            </div>
          </div>

          {/* Información de la función */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Información de la Función
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Fecha</p>
                <p className="text-white font-semibold">{fecha}</p>
              </div>
              <div>
                <p className="text-gray-400">Hora</p>
                <p className="text-white font-semibold">{hora}</p>
              </div>
              <div>
                <p className="text-gray-400">Sala</p>
                <p className="text-white font-semibold">
                  {sala?.nombreSala || `Sala ${reserva.idSala}`}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Reservado el</p>
                <p className="text-white font-semibold">{fechaReserva}</p>
              </div>
            </div>
          </div>

          {/* Asientos */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Asientos Reservados
            </h4>

            {loading ? (
              <div className="flex justify-center py-8">
                <CenteredSpinner size="sm" />
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-4">{error}</div>
            ) : asientos.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                No se encontraron asientos
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {asientos.map((asiento, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2 text-center"
                  >
                    <p className="text-purple-300 font-bold text-lg">
                      {asiento.filaAsiento}
                      {asiento.nroAsiento}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && asientos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total de asientos:</span>
                  <span className="text-white font-bold text-lg">
                    {asientos.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total Pagado</p>
                <p className="text-green-400 font-bold text-3xl">
                  ${reserva.total}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-blue-300 font-semibold mb-1">Importante</p>
                <p className="text-blue-200 text-sm">
                  Recuerda llegar 15 minutos antes de la función. Presenta tu
                  DNI en la boletería para retirar tus entradas.
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
            >
              Cerrar
            </button>
            <button
              onClick={onCancelar}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
            >
              Cancelar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleReservaModal;
