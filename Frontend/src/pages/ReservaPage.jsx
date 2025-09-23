
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFuncionesPorPeliculaYFecha } from "../api/Funciones.api";
import { getPelicula } from "../api/Peliculas.api";
import FuncionesReservaCard from "../components/FuncionesReservaCard";

function ReservaPage() {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [fecha, setFecha] = useState("");
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPelicula, setLoadingPelicula] = useState(true);

  useEffect(() => {
    const fetchPelicula = async () => {
      setLoadingPelicula(true);
      try {
        const data = await getPelicula(id);
        setPelicula(data);
      } catch (err) {
        setPelicula(null);
      } finally {
        setLoadingPelicula(false);
      }
    };
    fetchPelicula();
  }, [id]);

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleBuscar = async () => {
    if (!fecha || !pelicula?.idPelicula) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFuncionesPorPeliculaYFecha(pelicula.idPelicula, fecha);
      setFunciones(data);
    } catch (err) {
      setError("Error al obtener funciones");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="w-full max-w-3xl bg-slate-800 rounded-xl shadow-2xl p-8 mx-4">
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
            <div className="flex flex-col items-center mb-8">
              <div className="flex justify-center mb-4">
                {pelicula.portada ? (
                  <img src={pelicula.portada} alt={pelicula.nombrePelicula} className="w-56 h-80 object-cover rounded-xl border-2 border-slate-700 shadow bg-slate-700" />
                ) : (
                  <div className="w-56 h-80 flex items-center justify-center bg-slate-700 rounded-xl text-gray-400 border-2 border-slate-700">Sin portada</div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">{pelicula.nombrePelicula}</h2>
              <div className="text-gray-300 text-base mb-2 text-center">{pelicula.sinopsis || "Sin descripción."}</div>
              <div className="flex flex-wrap gap-4 text-gray-400 text-sm justify-center">
                <span><b>Director:</b> {pelicula.director || "-"}</span>
                <span><b>Género:</b> {pelicula.generoPelicula || "-"}</span>
                <span><b>Duración:</b> {pelicula.duracion ? `${pelicula.duracion} min` : "-"}</span>
                <span><b>Clasificación:</b> {pelicula.MPAA || "-"}</span>
                <span><b>Estreno:</b> {pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).toLocaleDateString() : "-"}</span>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Selecciona una fecha para ver funciones:</label>
              <div className="flex gap-4 items-center">
                <input
                  type="date"
                  value={fecha}
                  onChange={handleFechaChange}
                  className="border rounded px-3 py-2 w-48 bg-slate-700 text-white border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleBuscar}
                  disabled={!fecha || !pelicula?.idPelicula || loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                >
                  Buscar funciones
                </button>
              </div>
            </div>
            {loading && <p className="mt-4 text-white">Cargando funciones...</p>}
            {error && <p className="mt-4 text-red-400">{error}</p>}
            <div className="mt-6">
              {funciones.length > 0 ? (
                <div>
                  {funciones.map((f) => (
                    <FuncionesReservaCard
                      key={f.idFuncion || `${f.idSala}-${f.fechaHoraFuncion}`}
                      funcion={f}
                      onReservar={() => {/* Aquí puedes manejar la acción de reservar */}}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No hay funciones para la fecha seleccionada.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReservaPage;
