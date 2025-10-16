import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../api/login.api";
import { getReservas } from "../../../api/Reservas.api";
import { ClaquetaPersonaje } from "../../shared";

export default function MiPerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservasCount, setReservasCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

        // obtener cantidad de reservas del usuario (si existe endpoint)
        try {
          const all = await getReservas();
          const my = Array.isArray(all) ? all.filter(r => r.DNI === auth.user.DNI) : [];
          setReservasCount(my.length);
        } catch {
          setReservasCount(0);
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-black/60 via-purple-900/40 to-black/60 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
            <div className="flex-1 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {nombre} {apellido}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">DNI: <span className="text-gray-200 font-mono">{dni}</span></p>
                    <p className="text-sm text-gray-400">Email: <span className="text-gray-200 font-mono">{email}</span></p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-300 max-w-prose">
                Bienvenido a tu sala personal. Aquí puedes ver tus reservas y
                administrar tu cuenta.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-400">Reservas Totales</p>
                  <p className="text-lg justify font-bold text-fuchsia-700">{reservasCount}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-400">Reservas Activas</p>
                  <p className="text-lg justify font-bold text-green-700">{reservasCount}</p>
                </div>
                <button
                  onClick={() => navigate("/MisReservas")}
                  className=" px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Ver mis reservas
                </button>
              </div>

              <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-gray-400">
                <p className="mb-1">Sugerencia cinematográfica</p>
                <div className="text-white font-semibold">
                  "No olvides llegar 10 minutos antes — las cortinas no esperan."
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900/80 to-black/80 border-t border-slate-800 p-3 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5h18M3 19h18M3 5v14"/></svg>
              <span>Entrada digital preparada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}