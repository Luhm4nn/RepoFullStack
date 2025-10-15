import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFuncionesPorPeliculaYFecha } from "../../../api/Funciones.api";
import { getPelicula } from "../../../api/Peliculas.api";
import { formatDateTime } from "../../shared";
import SeatSelectorReserva from "../components/SeatSelectorReserva";
import PaymentStep from "../components/PaymentStep";
import { authAPI } from "../../../api/login.api";

function ReservaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [fecha, setFecha] = useState("");
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPelicula, setLoadingPelicula] = useState(true);

  // State para el flujo de reserva
  const [step, setStep] = useState(1); // 1: selección función, 2: selección asientos, 3: pago
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const [selectedSeatsInfo, setSelectedSeatsInfo] = useState({
    seats: [],
    total: 0,
    count: 0
  });
  const [userDNI, setUserDNI] = useState(null);

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

    // Verificar autenticación
    const auth = authAPI.checkAuth();
    if (auth && auth.user && auth.user.DNI) {
      setUserDNI(auth.user.DNI);
    }
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
      setError("Por favor, selecciona una fecha y asegúrate de que la película esté cargada.");
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedFuncion(null);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
    setStep(1);
    
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
    if (!userDNI) {
      alert("Debes iniciar sesión para realizar una reserva.");
      navigate('/login');
      return;
    }
    setSelectedFuncion(funcion);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
    setStep(2);
  };

  const handleSeatsChange = (info) => {
    setSelectedSeatsInfo(info);
  };

  const handleProcederAlPago = () => {
    if (selectedSeatsInfo.count === 0) {
      alert("Debes seleccionar al menos un asiento");
      return;
    }
    setStep(3);
  };

  const handlePaymentSuccess = () => {
    // El webhook del backend ya creó la reserva cuando el pago fue aprobado
    alert("¡Pago exitoso! Tu reserva ha sido confirmada.");
    navigate('/MisReservas');
  };

  const handleBackToSeats = () => {
    setStep(2);
  };

  const handleBackToFunctions = () => {
    setSelectedFuncion(null);
    setSelectedSeatsInfo({ seats: [], total: 0, count: 0 });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
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
            {/* Movie Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-1">
                <div className="relative">
                  <img
                    src={pelicula.portada || "/placeholder.svg"}
                    alt={pelicula.nombrePelicula}
                    className="w-full rounded-lg shadow-2xl bg-slate-700"
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-4">{pelicula.nombrePelicula}</h1>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-2 py-1 text-xs font-semibold">
                        {pelicula.MPAA}
                      </span>
                      <span className="text-gray-300">{pelicula.generoPelicula}</span>
                      <span className="flex items-center gap-1 text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                        </svg>
                        {pelicula.duracion} min
                      </span>
                      <span className="text-gray-300">
                        {pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).getFullYear() : ""}
                      </span>
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

            {/* Trailer Button */}
            <div className="mb-8 flex justify-start">
              <button
                className={`bg-red-600 text-white px-4 py-2 rounded flex items-center shadow-lg ${
                  pelicula.trailerURL || pelicula.url 
                    ? 'hover:bg-red-700 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (pelicula.trailerURL || pelicula.url) {
                    window.open(pelicula.trailerURL || pelicula.url, "_blank");
                  }
                }}
                disabled={!(pelicula.trailerURL || pelicula.url)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9-15-9z" />
                </svg>
                Ver Trailer
              </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow p-6">
              {/* Step 1: Selección de función */}
              {step === 1 && (
                <>
                  <h2 className="text-white text-2xl mb-6">Horarios y Reservas</h2>
                  <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <label className="block text-white font-medium">Selecciona una fecha:</label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={handleFechaChange}
                      className="border rounded px-3 py-2 w-48 bg-slate-700 text-white border-gray-600 focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleBuscar}
                      disabled={!fecha || loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {loading ? "Buscando..." : "Buscar funciones"}
                    </button>
                  </div>
                  
                  {loading && <p className="mt-4 text-white">Cargando funciones...</p>}
                  {error && <p className="mt-4 text-red-400">{error}</p>}
                  
                  <div className="space-y-6">
                    {funciones.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {funciones.map((funcion, idx) => {
                          const { hora } = formatDateTime(funcion.fechaHoraFuncion);
                          return (
                            <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex flex-col gap-2">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="text-2xl font-bold text-purple-400">{hora}</div>
                                <div className="text-sm text-gray-300 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                                  </svg>
                                  {funcion.sala?.nombreSala || `Sala ${funcion.idSala}`}
                                </div>
                              </div>
                              <div className="flex items-center justify-end">
                                <button
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded font-semibold"
                                  onClick={() => handleSelectFuncion(funcion)}
                                >
                                  Seleccionar Asientos
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      !loading && !error && <p className="text-gray-400">Selecciona una fecha para ver las funciones disponibles.</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Selección de asientos */}
              {step === 2 && selectedFuncion && (
                <>
                  <button
                    onClick={handleBackToFunctions}
                    className="mb-4 flex items-center text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a Funciones
                  </button>
                  
                  <h3 className="text-xl font-bold text-white mb-4">
                    Selecciona tus asientos - {formatDateTime(selectedFuncion.fechaHoraFuncion).hora} en {selectedFuncion.sala?.nombreSala || `Sala ${selectedFuncion.idSala}`}
                  </h3>
                  
                  <SeatSelectorReserva
                    idSala={selectedFuncion.idSala}
                    fechaHoraFuncion={selectedFuncion.fechaHoraFuncion}
                    onSeatsChange={handleSeatsChange}
                  />
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleProcederAlPago}
                      disabled={selectedSeatsInfo.count === 0}
                      className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceder al Pago ({selectedSeatsInfo.count} asientos - ${selectedSeatsInfo.total})
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Pago con MercadoPago */}
              {step === 3 && selectedFuncion && userDNI && (
                <PaymentStep
                  reservaData={{
                    DNI: userDNI,
                    fechaHoraReserva: new Date().toISOString()
                  }}
                  selectedSeatsData={selectedSeatsInfo}
                  funcion={selectedFuncion}
                  pelicula={pelicula}
                  onPaymentSuccess={handlePaymentSuccess}
                  onBack={handleBackToSeats}
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