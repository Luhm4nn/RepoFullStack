import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFuncionesPorPeliculaYFecha } from "../../../api/Funciones.api";
import { getPelicula } from "../../../api/Peliculas.api";
import { formatDateTime } from "../../shared";
import SeatSelectorReserva from "../components/SeatSelectorReserva";
import { createReserva } from "../../../api/Reservas.api";
import { createAsientosReservados } from "../../../api/AsientoReservas.api";
import { authAPI } from "../../../api/login.api";
import SeleccionFuncion from "../components/SeleccionFuncion";

function ReservaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [fecha, setFecha] = useState("");
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPelicula, setLoadingPelicula] = useState(true);

  // State para la función seleccionada para reservar asientos
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  // State para los asientos seleccionados y el total del precio
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState({
    seats: [],
    total: 0,
    count: 0
  });
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    const fetchPelicula = async () => {
      setLoadingPelicula(true);
      try {
        const data = await getPelicula(id);
        setPelicula(data);
      } catch (err) {
        setPelicula(null);
        setError("Error al cargar los detalles de la película.");
      } finally {
        setLoadingPelicula(false);
      }
    };
    fetchPelicula();
  }, [id]);

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setFunciones([]); // Limpiar funciones al cambiar la fecha
    setSelectedFuncion(null); // Limpiar selección de función
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 }); // Limpiar selección de asientos
  };

  const handleBuscar = async () => {
    if (!fecha || !pelicula?.idPelicula) {
      setError("Por favor, selecciona una fecha y asegúrate de que la película esté cargada.");
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedFuncion(null); // Limpiar selección de función al buscar nuevas funciones
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 }); // Limpiar selección de asientos
    try {
      const data = await getFuncionesPorPeliculaYFecha(pelicula.idPelicula, fecha);
      setFunciones(data);
      if (data.length === 0) {
        setError("No hay funciones disponibles para la fecha seleccionada.");
      }
    } catch (err) {
      setError("Error al obtener funciones para la fecha seleccionada.");
      console.error("Error fetching funciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFuncion = (funcion) => {
    setSelectedFuncion(funcion);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
  };

  const handleSeatsChange = (info) => {
    setSelectedSeatsInfo(info);
  };

  const handleConfirmarReserva = async () => {
    if (!selectedFuncion || selectedSeatsInfo.count === 0) {
      setReservationError("Por favor, selecciona una función y al menos un asiento.");
      return;
    }

    const auth = authAPI.checkAuth();
    if (!auth || !auth.user || !auth.user.DNI) {
      setReservationError("Debes iniciar sesión para realizar una reserva.");
      navigate('/login');
      return;
    }

    setReservationLoading(true);
    setReservationError(null);

    try {
      const DNI = auth.user.DNI;
      const fechaHoraReserva = new Date().toISOString();

      const reservaData = {
        idSala: selectedFuncion.idSala,
        fechaHoraFuncion: selectedFuncion.fechaHoraFuncion,
        DNI: DNI,
        total: selectedSeatsInfo.total,
        fechaHoraReserva: fechaHoraReserva,
      };
      const newReserva = await createReserva(reservaData);
      const asientosParaReservar = selectedSeatsInfo.seats.map(seat => ({
        idSala: selectedFuncion.idSala,
        filaAsiento: seat.filaAsiento,
        nroAsiento: seat.nroAsiento,
        fechaHoraFuncion: selectedFuncion.fechaHoraFuncion,
        DNI: DNI,
        fechaHoraReserva: fechaHoraReserva,
      }));

      await createAsientosReservados(asientosParaReservar);

      alert("Reserva realizada con éxito!");
      navigate('/MisReservas');
    } catch (err) {
      setReservationError("Error al confirmar la reserva. Inténtalo de nuevo.");
      console.error("Error confirming reservation:", err);
    } finally {
      setReservationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
        >
          <span className="w-4 h-4 mr-2 inline-block align-middle">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </span>
          Volver a Cartelera
        </button>

        {/* Movie Details */}
        {loadingPelicula ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-white text-lg">Cargando película...</span>
          </div>
        ) : !pelicula ? (
          <div className="flex flex-col items-center justify-center h-40">
            <span className="text-red-400 text-xl mb-4">Película no encontrada.</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <img
                    src={pelicula.portada || "/placeholder.svg"}
                    alt={pelicula.nombrePelicula}
                    className="w-full rounded-lg shadow-2xl bg-slate-700"
                  />
                </div>
              </div>
              {/* Movie Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-4">{pelicula.nombrePelicula}</h1>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-2 py-1 text-xs font-semibold">{pelicula.MPAA}</span>
                      <span className="text-gray-300">{pelicula.generoPelicula}</span>
                      <span className="flex items-center gap-1 text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                        {pelicula.duracion} min
                      </span>
                      <span className="text-gray-300">{pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).getFullYear() : ""}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Sinopsis</h3>
                    <p className="text-gray-300 leading-relaxed">{pelicula.sinopsis}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Director</h3>
                    <p className="text-gray-300">{pelicula.director}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Botón Ver Trailer siempre visible, deshabilitado si no hay trailer */}
            <div className="mb-8 flex justify-start">
              <button
                className={`bg-red-600 text-white px-4 py-2 rounded flex items-center shadow-lg ${pelicula.trailerURL || pelicula.url ? 'hover:bg-red-700 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => {
                  if (pelicula.trailerURL || pelicula.url) {
                    window.open(pelicula.trailerURL || pelicula.url, "_blank");
                  }
                }}
                disabled={!(pelicula.trailerURL || pelicula.url)}
              >
                <span className="w-4 h-4 mr-2 inline-block align-middle">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9-15-9z" /></svg>
                </span>
                Ver Trailer
              </button>
            </div>
            {/* Showtimes */}
            <div id="funciones" className="bg-slate-800/50 border border-slate-700 rounded-xl shadow p-6">
              <h2 className="text-white text-2xl mb-6">Horarios y Reservas</h2>
              
              {selectedFuncion ? (
                <div>
                  <button
                    onClick={() => setSelectedFuncion(null)}
                    className="mb-4 flex items-center text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
                  >
                    <span className="w-4 h-4 mr-2 inline-block align-middle">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </span>
                    Volver a Funciones
                  </button>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Selecciona tus asientos para:{" "}
                    {formatDateTime(selectedFuncion.fechaHoraFuncion).hora}{" "}
                    en Sala {selectedFuncion.sala?.nombreSala || selectedFuncion.idSala}
                  </h3>
                  <SeatSelectorReserva
                    idSala={selectedFuncion.idSala}
                    fechaHoraFuncion={selectedFuncion.fechaHoraFuncion}
                    onSeatsChange={handleSeatsChange}
                  />
                   {reservationError && (
                    <p className="mt-4 text-red-400 text-center">{reservationError}</p>
                  )}
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleConfirmarReserva}
                      disabled={selectedSeatsInfo.count === 0 || reservationLoading}
                      className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reservationLoading ? "Confirmando..." : `Confirmar Reserva (${selectedSeatsInfo.count} asientos - $${selectedSeatsInfo.total})`}
                    </button>
                  </div>
                </div>
              ) : (
                <SeleccionFuncion
                  funciones={funciones}
                  loading={loading}
                  error={error}
                  fecha={fecha}
                  onFechaChange={handleFechaChange}
                  onBuscar={handleBuscar}
                  onSelectFuncion={handleSelectFuncion}
                  idPelicula={pelicula.idPelicula}

                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReservaPage;