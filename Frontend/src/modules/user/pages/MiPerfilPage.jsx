import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../api/login.api";
import { getReservas } from "../../../api/Reservas.api";
import ClaquetaPersonaje from "../../shared/components/ClaquetaPersonaje";

export default function MiPerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const asientoFavorito = useMemo(() => {
    const counter = {};
    for (const r of reservas) {
      const as = r.asientos ?? r.seats ?? r.selectedSeats ?? [];
      if (Array.isArray(as)) {
        for (const s of as) {
          const key = typeof s === "string" ? s : JSON.stringify(s);
          counter[key] = (counter[key] || 0) + 1;
        }
      }
    }
    const entries = Object.entries(counter);
    if (!entries.length) return "—";
    const [fav] = entries.sort((a, b) => b[1] - a[1]);
    return fav[0];
  }, [reservas]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const auth = authAPI.checkAuth();
        if (!auth?.user) {
          navigate("/login");
          return;
        }
        setUser(auth.user);
        try {
          const all = await getReservas();
          const my = Array.isArray(all) ? all.filter(r => r.DNI === auth.user.DNI) : [];
          my.sort((a, b) => new Date(a.fechaHoraFuncion) - new Date(b.fechaHoraFuncion));
          setReservas(my);
        } catch (e) {
          setReservas([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-pulse text-center text-gray-300">
          <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4" />
          <p className="text-sm">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const nombre = user?.nombreUsuario ?? user?.nombre ?? "Nombre";
  const apellido = user?.apellidoUsuario ?? user?.apellido ?? "Apellido";
  const dni = user?.DNI ?? "—";
  const email = user?.email ?? "—";

  const now = new Date();

  const reservasActivas = reservas.filter(r => r.estado === "ACTIVA" && new Date(r.fechaHoraFuncion) >= now);
  const reservasFinalizadas = reservas.filter(r => new Date(r.fechaHoraFuncion) < now);
  const totalGastado = reservas.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);

  const proximaReserva = reservas
    .filter(r => r.estado === "ACTIVA" && new Date(r.fechaHoraFuncion) >= now)
    .sort((a, b) => new Date(a.fechaHoraFuncion) - new Date(b.fechaHoraFuncion))[0];

  const ultimaReserva = reservas
    .slice()
    .sort((a, b) => new Date(b.fechaHoraReserva || b.fechaHoraFuncion) - new Date(a.fechaHoraReserva || a.fechaHoraFuncion))[0];

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 text-center">Mi Perfil</h1>

        <div className="bg-gradient-to-r from-black/60 via-purple-900/30 to-black/60 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-5 md:p-8 items-start">
            {/* Claqueta integrada en md+ */}
            <div className="hidden md:flex justify-center items-start">
              <ClaquetaPersonaje fixed={false} messageInterval={12000} size={110} className="self-start" />
            </div>

            {/* Avatar + basic info (col-span 3 en md) */}
            <div className="md:col-span-3 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    { (nombre[0] ?? "N") + (apellido[0] ?? "") }
                  </div>
                </div>

                {/* Nombre y acciones */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight truncate">
                    {nombre} {apellido}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 truncate">DNI: <span className="text-gray-200 font-mono">{dni}</span></p>
                  <p className="text-sm text-gray-400 truncate">Email: <span className="text-gray-200 font-mono">{email}</span></p>

                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <button
                      onClick={() => navigate("/Perfil/Editar")}
                      className="px-3 py-2 bg-slate-800/70 border border-slate-700 text-white rounded-md text-sm hover:bg-slate-800 transition"
                    >
                      Editar Perfil
                    </button>

                    <button
                      onClick={() => navigate("/MisReservas")}
                      className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-sm hover:opacity-95 transition"
                    >
                      Ver mis reservas
                    </button>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p className="mt-4 text-sm text-gray-300 max-w-prose break-words">
                Bienvenido a tu sala personal. Aquí puedes ver tus reservas, descargar entradas y administrar tu cuenta.
                Mantén tus datos actualizados y no te pierdas las próximas funciones.
              </p>

              {/* Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col">
                  <span className="text-xs text-gray-400">Reservas Totales</span>
                  <span className="text-lg font-bold text-white">{reservas.length}</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col">
                  <span className="text-xs text-gray-400">Reservas Activas</span>
                  <span className="text-lg font-bold text-green-400">{reservasActivas.length}</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col">
                  <span className="text-xs text-gray-400">Total Gastado</span>
                  <span className="text-lg font-bold text-fuchsia-400">${totalGastado.toFixed(2)}</span>
                </div>
              </div>

              {/* Próxima / Última reserva */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-300">Próxima Reserva</h3>
                  {proximaReserva ? (
                    <>
                      <p className="mt-2 text-white font-semibold">{proximaReserva.tituloPelicula ?? proximaReserva.pelicula ?? "Función"}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(proximaReserva.fechaHoraFuncion)}</p>
                      <p className="text-xs text-gray-400 mt-2">Sala: <span className="text-gray-200">{proximaReserva.idSala ?? proximaReserva.sala ?? "—"}</span></p>
                    </>
                  ) : (
                    <p className="mt-2 text-gray-400">No hay próximas reservas</p>
                  )}
                </div>

                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-300">Última Reserva</h3>
                  {ultimaReserva ? (
                    <>
                      <p className="mt-2 text-white font-semibold">{ultimaReserva.tituloPelicula ?? ultimaReserva.pelicula ?? "Función"}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(ultimaReserva.fechaHoraReserva ?? ultimaReserva.fechaHoraFuncion)}</p>
                      <p className="text-xs text-gray-400 mt-2">Asiento: <span className="text-gray-200">{(ultimaReserva.asientos && ultimaReserva.asientos[0]) ?? ultimaReserva.seat ?? "—"}</span></p>
                    </>
                  ) : (
                    <p className="mt-2 text-gray-400">Aún no realizaste reservas</p>
                  )}
                </div>
              </div>

              {/* extras */}
              <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-gray-400">
                <p className="mb-1">Datos rápidos</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-2 py-1 bg-slate-800/50 rounded text-xs">Asiento favorito: <strong className="text-white ml-1">{asientoFavorito}</strong></span>
                  <span className="px-2 py-1 bg-slate-800/50 rounded text-xs">Reservas finalizadas: <strong className="text-white ml-1">{reservasFinalizadas.length}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* footer strip */}
          <div className="bg-gradient-to-r from-slate-900/80 to-black/80 border-t border-slate-800 p-3 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span>© 2025 CUTZY</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Perfil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}