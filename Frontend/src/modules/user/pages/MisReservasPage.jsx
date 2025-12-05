import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserReservas } from "../../../api/Reservas.api";
import { authAPI } from "../../../api/login.api";
import MisReservasList from "../components/MisReservasList";

function MisReservasPage() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("todas"); // todas, activas, canceladas, pasadas

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    aplicarFiltro();
  }, [filter, reservas]);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = authAPI.checkAuth();
      if (!auth || !auth.user || !auth.user.DNI) {
        navigate('/login');
        return;
      }

      // Usar el nuevo endpoint que ya filtra por usuario
      const misReservas = await getUserReservas();

      setReservas(misReservas);
    } catch (err) {
      console.error("Error fetching reservas:", err);
      if (err.response?.status === 404) {
        // No hay reservas, no es un error
        setReservas([]);
      } else {
        setError("Error al cargar tus reservas");
      }
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = () => {
    const ahora = new Date();

    let filtradas = [...reservas];

    switch (filter) {
      case "activas":
        filtradas = reservas.filter(r =>
          r.estado === "ACTIVA" && new Date(r.fechaHoraFuncion) >= ahora
        );
        break;
      case "canceladas":
        filtradas = reservas.filter(r => r.estado === "CANCELADA");
        break;
      case "pasadas":
        filtradas = reservas.filter(r =>
          new Date(r.fechaHoraFuncion) < ahora && r.estado === "ACTIVA"
        );
        break;
      case "todas":
      default:
        // Ya están todas
        break;
    }

    setReservasFiltradas(filtradas);
  };

  const handleReservaActualizada = () => {
    fetchReservas(); // Recargar reservas después de cancelar
  };

  const getFilterCount = (filterType) => {
    const ahora = new Date();
    switch (filterType) {
      case "activas":
        return reservas.filter(r =>
          r.estado === "ACTIVA" && new Date(r.fechaHoraFuncion) >= ahora
        ).length;
      case "canceladas":
        return reservas.filter(r => r.estado === "CANCELADA").length;
      case "pasadas":
        return reservas.filter(r =>
          new Date(r.fechaHoraFuncion) < ahora && r.estado === "ACTIVA"
        ).length;
      case "todas":
        return reservas.length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Mis Reservas</h1>
              <p className="text-gray-400 text-sm sm:text-base">Administra tus reservas de películas</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 sm:p-2 inline-flex flex-wrap gap-1 sm:gap-2 min-w-[320px]">
            <button
              onClick={() => setFilter("todas")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-base ${filter === "todas"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
            >
              Todas ({getFilterCount("todas")})
            </button>
            <button
              onClick={() => setFilter("activas")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-base ${filter === "activas"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
            >
              Activas ({getFilterCount("activas")})
            </button>
            <button
              onClick={() => setFilter("pasadas")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-base ${filter === "pasadas"
                  ? "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
            >
              Pasadas ({getFilterCount("pasadas")})
            </button>
            <button
              onClick={() => setFilter("canceladas")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-base ${filter === "canceladas"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
            >
              Canceladas ({getFilterCount("canceladas")})
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {!loading && !error && reservas.length > 0 && (
          <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Reservas Activas</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{getFilterCount("activas")}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Reservas</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{reservas.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Gastado</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    ${reservas.reduce((sum, r) => sum + parseFloat(r.total || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 sm:p-8 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">{error}</h3>
            <button
              onClick={fetchReservas}
              className="mt-4 px-4 py-2 sm:px-6 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <MisReservasList
            reservas={reservasFiltradas}
            onReservaActualizada={handleReservaActualizada}
          />
        )}
      </div>
    </div>
  );
}

export default MisReservasPage;