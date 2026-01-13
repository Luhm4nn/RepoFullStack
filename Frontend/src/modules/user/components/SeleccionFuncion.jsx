import { useEffect, useState } from "react";
import { formatDateTime } from "../../shared";
import { getFuncionesSemana } from "../../../api/Funciones.api";
import { InlineSpinner } from "../../shared/components/Spinner";

function getDaysOfWeek() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      isToday: i === 0,
    });
  }
  return days;
}

function SeleccionFuncion({ idPelicula, onSelectFuncion }) {
  const [funcionesSemana, setFuncionesSemana] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getDaysOfWeek()[0].date);

  useEffect(() => {
    if (!idPelicula) return;
    setLoading(true);
    setError(null);
    getFuncionesSemana(idPelicula)
      .then((data) => {
        setFuncionesSemana(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error cargando funciones:", error);
        setFuncionesSemana([]);
        setError("No se pudieron cargar las funciones de la semana.");
      })
      .finally(() => setLoading(false));
  }, [idPelicula]);

  const days = getDaysOfWeek();

  // Filtrar funciones por el día seleccionado
  const funcionesFiltradas = funcionesSemana.filter(
    (f) => f.fechaHoraFuncion && f.fechaHoraFuncion.startsWith(selectedDay)
  );

  return (
    <>
      {/* Desktop: Botones horizontales - SOLO visible en tablets y desktop */}
      <div className="mb-6 hidden md:flex gap-2 overflow-x-auto scrollbar-thin">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(day.date)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors min-w-[110px] whitespace-nowrap ${
              selectedDay === day.date
                ? "bg-purple-700 text-white shadow"
                : "bg-slate-700 text-gray-300 hover:bg-purple-800"
            }`}
          >
            {day.label}
            {day.isToday && (
              <span className="ml-2 text-xs text-green-300">(Hoy)</span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile: Select dropdown - SOLO visible en mobile */}
      <div className="mb-6 block md:hidden">
        <label htmlFor="day-select" className="block text-gray-300 mb-2 font-medium text-sm">
          Selecciona un día:
        </label>
        <select
          id="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.5rem',
          }}
        >
          {days.map((day) => (
            <option key={day.date} value={day.date}>
              {day.label} {day.isToday ? "(Hoy)" : ""}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="mt-4">
          <InlineSpinner text="Cargando funciones" />
        </div>
      )}
      {error && <p className="mt-4 text-red-400">{error}</p>}
      
      <div className="space-y-6">
        {funcionesFiltradas.length > 0 ? (
          <>
            {/* Mobile: Lista vertical optimizada - SOLO mobile */}
            <div className="block md:hidden space-y-3">
              {funcionesFiltradas.map((funcion, idx) => {
                const { hora } = formatDateTime(funcion.fechaHoraFuncion);
                const salaTexto = funcion.sala?.nombreSala || `Sala ${funcion.idSala}`;
                
                return (
                  <div
                    key={funcion.idFuncion || idx}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {hora}
                        </div>
                        <div className="text-sm text-gray-300 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="font-medium">{salaTexto}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95 text-white px-4 py-3 rounded-lg font-semibold text-base shadow-lg transition-all"
                      onClick={() => onSelectFuncion(funcion)}
                    >
                      Seleccionar Asientos
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop/Tablet: Grid - SOLO tablets y desktop */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {funcionesFiltradas.map((funcion, idx) => {
                const { hora } = formatDateTime(funcion.fechaHoraFuncion);
                return (
                  <div
                    key={funcion.idFuncion || idx}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl font-bold text-purple-400">
                        {hora}
                      </div>
                      <div className="text-sm text-gray-300 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5"
                          />
                        </svg>
                        {funcion.sala?.nombreSala || funcion.sala || funcion.idSala}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded font-semibold"
                        onClick={() => onSelectFuncion(funcion)}
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          !loading &&
          !error && (
            <p className="text-gray-400">No hay funciones para este día.</p>
          )
        )}
      </div>
    </>
  );
}

export default SeleccionFuncion;
