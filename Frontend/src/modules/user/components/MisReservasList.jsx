import { useState } from "react";
import { cancelReserva } from "../../../api/Reservas.api";
import { formatDateTime } from "../../../utils/dateFormater";
import DetalleReservaModal from "./DetalleReservaModal";
import { useNotification } from '../../../context/NotificationContext';

function MisReservasList({ reservas, onReservaActualizada }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const notify = useNotification();

  const handleCancelar = async (reserva) => {
    const ahora = new Date();
    const fechaFuncion = new Date(reserva.fechaHoraFuncion);
    
    // Verificar si la función ya pasó
    if (fechaFuncion < ahora) {
      notify.warning("No puedes cancelar una reserva de una función que ya pasó.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro que deseas cancelar la reserva para "${reserva.funcion?.pelicula?.nombrePelicula}"?`
    );

    if (!confirmacion) return;

    setCancellingId(`${reserva.idSala}-${reserva.fechaHoraFuncion}-${reserva.DNI}-${reserva.fechaHoraReserva}`);

    try {
      await cancelReserva(
        reserva.idSala,
        reserva.fechaHoraFuncion,
        reserva.DNI,
        reserva.fechaHoraReserva
      );
      
      if (onReservaActualizada) {
        onReservaActualizada();
      }
    } catch (err) {
      notify.error("Error al cancelar la reserva. Intenta nuevamente.");
    } finally {
      setCancellingId(null);
    }
  };

  const getEstadoBadge = (estado, funcionPasada) => {
    // Si la función pasó, mostrar solo badge de "FINALIZADA"
    if (funcionPasada && (estado === "ACTIVA" || estado === "ASISTIDA")) {
      return null; // No mostrar badge de ACTIVA/ASISTIDA si ya pasó
    }

    switch (estado) {
      case "ACTIVA":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "ASISTIDA":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "CANCELADA":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "NO_ASISTIDA":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "FINALIZADA":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const esFuncionPasada = (fechaHoraFuncion) => {
    return new Date(fechaHoraFuncion) < new Date();
  };

  if (reservas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 mb-6 opacity-50">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-full h-full text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No tienes reservas</h3>
        <p className="text-gray-400 mb-6">Explora nuestra cartelera y reserva tu película favorita</p>
        <a
          href="/cartelera"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Ver Cartelera
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {reservas.map((reserva) => {
        const { fecha, hora } = formatDateTime(reserva.fechaHoraFuncion);
        const { fecha: fechaReserva } = formatDateTime(reserva.fechaHoraReserva);
        const pelicula = reserva.funcion?.pelicula;
        const sala = reserva.funcion?.sala;
        const funcionPasada = esFuncionPasada(reserva.fechaHoraFuncion);
        const reservaId = `${reserva.idSala}-${reserva.fechaHoraFuncion}-${reserva.DNI}-${reserva.fechaHoraReserva}`;
        const isCancelling = cancellingId === reservaId;

        return (
          <div
            key={reservaId}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Poster de la película */}
              <div className="lg:col-span-1">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={pelicula?.portada || "/placeholder.svg"}
                    alt={pelicula?.nombrePelicula || "Película"}
                    className="w-full h-full object-cover"
                  />
                  {funcionPasada && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">FUNCIÓN FINALIZADA</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de la reserva */}
              <div className="lg:col-span-3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {pelicula?.nombrePelicula || "Película desconocida"}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getEstadoBadge(reserva.estado, funcionPasada) && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoBadge(reserva.estado, funcionPasada)}`}>
                            {reserva.estado}
                          </span>
                        )}
                        {funcionPasada && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-500/20 text-gray-300 border-gray-500/30">
                            FINALIZADA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la función */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Fecha y hora</p>
                          <p className="text-white font-semibold">{fecha} • {hora}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Sala</p>
                          <p className="text-white font-semibold">{sala?.nombreSala || `Sala ${reserva.idSala}`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Reservado el</p>
                          <p className="text-white font-semibold">{fechaReserva}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Total</p>
                          <p className="text-green-400 font-bold text-xl">${reserva.total}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  {pelicula && (
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span>{pelicula.generoPelicula}</span>
                      <span>•</span>
                      <span>{pelicula.duracion} min</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {pelicula.MPAA}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-700">
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                      onClick={() => setReservaSeleccionada(reserva)}
                    >
                      Ver Detalles
                    </button>
                    {reserva.estado === "ACTIVA" && !funcionPasada && (
                      <button
                        onClick={() => handleCancelar(reserva)}
                        disabled={isCancelling}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCancelling ? "Cancelando..." : "Cancelar Reserva"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal de detalles */}
      {reservaSeleccionada && (
        <DetalleReservaModal
          reserva={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
          onCancelar={() => {
            handleCancelar(reservaSeleccionada);
            setReservaSeleccionada(null);
          }}
        />
      )}
    </div>
  );
}

export default MisReservasList;