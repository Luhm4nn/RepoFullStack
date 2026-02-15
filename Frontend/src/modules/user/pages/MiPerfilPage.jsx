import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../api/login.api";
import { getUserReservas } from "../../../api/Reservas.api";
import ClaquetaPersonaje from "../../shared/components/ClaquetaPersonaje";
import { CenteredSpinner } from "../../shared/components/Spinner";
import { ESTADOS_RESERVA } from "../../../constants";

export default function MiPerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const auth = await authAPI.checkAuth();
        if (!auth?.user) {
          navigate("/login");
          return;
        }
        setUser(auth.user);
        try {
          // Usar endpoint optimizado que ya filtra por usuario
          const data = await getUserReservas();
          const my = Array.isArray(data) ? data : [];
          my.sort(
            (a, b) =>
              new Date(a.funcion?.fechaHoraFuncion) -
              new Date(b.funcion?.fechaHoraFuncion)
          );
          setReservas(my);
        } catch (e) {
          console.error("Error cargando reservas:", e);
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
        <div className="text-center">
          <CenteredSpinner size="md" />
          <p className="text-white mt-4">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const nombre = user?.nombreUsuario ?? user?.nombre ?? "Nombre";
  const apellido = user?.apellidoUsuario ?? user?.apellido ?? "Apellido";
  const dni = user?.DNI ?? "—";
  const email = user?.email ?? "—";
  const telefono = user?.telefono;

  const now = new Date();

  const reservasActivas = reservas.filter(
    (r) =>
      r.estado === ESTADOS_RESERVA.ACTIVA &&
      new Date(r.funcion?.fechaHoraFuncion) >= now
  );
  const reservasFinalizadas = reservas.filter(
    (r) => new Date(r.funcion?.fechaHoraFuncion) < now
  );
  const totalGastado = reservas.reduce(
    (s, r) => s + (parseFloat(r.total) || 0),
    0
  );

  const sortedReservas = [...reservas].sort(
    (a, b) =>
      new Date(b.fechaHoraReserva || b.funcion?.fechaHoraFuncion) -
      new Date(a.fechaHoraReserva || a.funcion?.fechaHoraFuncion)
  );

  const proximaReserva = reservas
    .filter(
      (r) =>
        r.estado === ESTADOS_RESERVA.ACTIVA &&
        new Date(r.funcion?.fechaHoraFuncion) >= now
    )
    .sort(
      (a, b) =>
        new Date(a.funcion?.fechaHoraFuncion) -
        new Date(b.funcion?.fechaHoraFuncion)
    )[0];

  const ultimaReserva = sortedReservas[0];

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-black/30 p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          {/* Avatar Moderno */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-32 h-32 rounded-full bg-slate-900 border-2 border-purple-500/30 flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-400 shadow-inner">
              {((nombre[0] ?? "N") + (apellido[0] ?? "")).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-slate-900 rounded-full shadow-lg"></div>
          </div>

          <div className="flex-1 text-center md:text-left min-w-0 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight break-words leading-tight">
              {nombre}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-400 tracking-tight break-words leading-none mt-1 opacity-90">
              {apellido}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <span className="font-medium">{email}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.251 8.251 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">DNI: {dni}</span>
              </div>

              {telefono && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l.453 1.814a1.875 1.875 0 0 1-1.121 2.183l-1.103.441a1.875 1.875 0 0 0-1.066 2.393 12.83 12.83 0 0 0 4.639 4.639 1.875 1.875 0 0 0 2.393-1.066l.441-1.103a1.875 1.875 0 0 1 2.183-1.121l1.814.453c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{telefono}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => navigate("/mi-perfil/editar")}
                className="group relative px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10">Editar Perfil</span>
              </button>
              <button
                onClick={() => navigate("/mis-reservas")}
                className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all hover:scale-105"
              >
                Mis Reservas
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Reservas</p>
            <h3 className="text-4xl font-black text-white mt-1">{reservas.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Activas ahora</p>
            <h3 className="text-4xl font-black text-green-400 mt-1">{reservasActivas.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Inversión Cine</p>
            <h3 className="text-4xl font-black text-blue-400 mt-1">${totalGastado.toFixed(2)}</h3>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Próxima Función</h2>
            </div>
            
            {proximaReserva ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-purple-400 font-bold text-lg leading-tight uppercase tracking-tight">
                    {proximaReserva.funcion?.pelicula?.nombrePelicula || "Reserva de Cine"}
                  </p>
                  <p className="text-white font-medium mt-1">
                    {formatDateTime(proximaReserva.fechaHoraFuncion)}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sala: <span className="text-white font-bold">{proximaReserva.idSala ?? proximaReserva.sala ?? "—"}</span></span>
                    <button 
                      onClick={() => navigate("/mis-reservas")}
                      className="text-purple-400 text-xs font-bold hover:underline"
                    >
                      VER QR →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-50">
                <p className="text-gray-400">No tienes funciones pendientes.</p>
                <button 
                  onClick={() => navigate("/cartelera")}
                  className="mt-4 text-sm text-purple-400 font-bold hover:underline"
                >
                  Ir a Cartelera
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
            </div>

            {sortedReservas.length > 0 ? (
              <div className="space-y-4">
                {sortedReservas.slice(0, 3).map((reserva, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-100 font-bold truncate">
                        {reserva.funcion?.pelicula?.nombrePelicula || "Reserva de Cine"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {reserva.estado === 'ACTIVA' ? 'Reservada el' : 'Fecha de función:'} {formatDateTime(reserva.fechaHoraReserva ?? reserva.fechaHoraFuncion)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10 opacity-50">Explora nuestra cartelera.</p>
            )}
          </div>
        </div>

        {/* Claqueta flotante decorativa */}
        <div className="mt-12 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
           <ClaquetaPersonaje size={80} messageInterval={15000} />
        </div>
      </div>
    </div>
  );
}
