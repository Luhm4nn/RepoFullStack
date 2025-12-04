import { useEffect, useState } from "react";
import { formatDateTime } from "../../shared";
import { getFuncionesSemana } from "../../../api/Funciones.api";

function getDaysOfWeek() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }),
      isToday: i === 0,
    });
  }
  return days;
}

function SeleccionFuncion({
  idPelicula,
  onSelectFuncion,
}) {
  const [funcionesSemana, setFuncionesSemana] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getDaysOfWeek()[0].date);

  useEffect(() => {
    if (!idPelicula) return;
    setLoading(true);
    setError(null);
    getFuncionesSemana(idPelicula)
      .then(data => setFuncionesSemana(data))
      .catch(() => setError("No se pudieron cargar las funciones de la semana."))
      .finally(() => setLoading(false));
  }, [idPelicula]);

  const days = getDaysOfWeek();

  // Filtrar funciones por el día seleccionado
  const funcionesFiltradas = funcionesSemana.filter(f =>
    f.fechaHoraFuncion && f.fechaHoraFuncion.startsWith(selectedDay)
  );

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-thin">
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(day.date)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors min-w-[110px] ${
              selectedDay === day.date
                ? "bg-purple-700 text-white shadow"
                : "bg-slate-700 text-gray-300 hover:bg-purple-800"
            }`}
          >
            {day.label}
            {day.isToday && <span className="ml-2 text-xs text-green-300">(Hoy)</span>}
          </button>
        ))}
      </div>
      {loading && <p className="mt-4 text-white">Cargando funciones...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <div className="space-y-6">
        {funcionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funcionesFiltradas.map((funcion, idx) => {
              const { hora } = formatDateTime(funcion.fechaHoraFuncion);
              return (
                <div key={funcion.idFuncion || idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl font-bold text-purple-400">{hora}</div>
                    <div className="text-sm text-gray-300 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" /></svg>
                      {funcion.sala?.nombreSala || funcion.sala || funcion.idSala}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <span className="text-green-400">{funcion.asientosDisponibles ?? "-"} disponibles</span>
                    </div>
                    <button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded font-semibold"
                      onClick={() => onSelectFuncion(funcion)}
                    >
                      Seleccionar Asientos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && !error && (
            <p className="text-gray-400">
              No hay funciones para este día.
            </p>
          )
        )}
      </div>
    </>
  );
}

export default SeleccionFuncion;