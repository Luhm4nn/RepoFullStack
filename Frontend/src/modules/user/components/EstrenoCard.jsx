import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function EstrenoCard({ estrenos = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!estrenos || estrenos.length === 0) {
    return (
      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-8 text-center">
        <p className="text-gray-400">No hay estrenos disponibles</p>
      </div>
    );
  }

  const pelicula = estrenos[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? estrenos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === estrenos.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    if (estrenos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % estrenos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [estrenos.length]);

  return (
    <div className="w-full relative rounded-xl">
      <div className="absolute inset-1 bg-slate-800/60 border border-slate-700 rounded-xl opacity-75"></div>

      <div className="relative bg-slate-800/60 rounded-xl border-slate-700 shadow-lg overflow-hidden">
        {/* Slider container */}
        <div className="relative h-96 w-full bg-black overflow-hidden">
          {estrenos.map((est, index) => (
            <div
              key={index}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {est.portada ? (
                <img
                  src={est.portada}
                  alt={est.nombrePelicula}
                  className="object-cover h-full w-full"
                  style={{
                    objectPosition: "center 30%",
                    filter: "brightness(0.6) contrast(1.1)",
                  }}
                />
              ) : (
                <svg className="w-32 h-32 text-slate-500 mx-auto mt-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                </svg>
              )}

              {/* Overlay con gradiente cinematográfico */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            </div>
          ))}

          {/* Botones de navegación */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-2 border-white/40 transition-all duration-300 shadow-xl shadow-purple-500/50 hover:scale-110 z-20"
            aria-label="Película anterior"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-2 border-white/40 transition-all duration-300 shadow-xl shadow-purple-500/50 hover:scale-110 z-20"
            aria-label="Película siguiente"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Indicador de slides con barra de progreso */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full border border-white/20">
            {estrenos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? "h-2 w-8 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
                    : "h-2 w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Ir a película ${index + 1}`}
              />
            ))}
          </div>

          {/* Efecto de película: línea de escaneo sutil */}
          <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scan"></div>
          </div>
        </div>

        {/* Información de la pelicula */}
        <div className="p-6 md:p-8 space-y-4 relative overflow-hidden">
          {/* Efecto de fondo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

          {/* Título con animación */}
          <div className="overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-semibold text-white transition-all duration-500">
              {pelicula.nombrePelicula}
            </h2>
          </div>

          <div className="text-gray-300 text-sm md:text-base">{pelicula.generoPelicula}</div>

          {/* Grid de información */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <div className="text-gray-400 text-xs font-semibold uppercase">Duración</div>
              <div className="text-gray-200">{pelicula.duracion ? `${pelicula.duracion} min` : "N/D"}</div>
            </div>

            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <div className="text-gray-400 text-xs font-semibold uppercase">Clasificación</div>
              <div className="text-gray-200">{pelicula.MPAA || "N/D"}</div>
            </div>

            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <div className="text-gray-400 text-xs font-semibold uppercase">Director</div>
              <div className="text-gray-200 truncate">{pelicula.director || "N/D"}</div>
            </div>

            <div className="transition-all duration-500 hover:translate-y-[-2px]">
              <div className="text-gray-400 text-xs font-semibold uppercase">Estreno</div>
              <div className="text-gray-200">{new Date(pelicula.fechaEstreno).toLocaleDateString("es-ES")}</div>
            </div>
          </div>

          <div className="transition-all duration-500">
            <div className="text-gray-400 text-xs font-semibold uppercase mb-2">Sinopsis</div>
            <p className="text-gray-300 text-sm line-clamp-3">{pelicula.sinopsis || "Sin sinopsis disponible"}</p>
          </div>

          {pelicula.trailerURL && (
            <a
              href={pelicula.trailerURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/70"
            >
              Ver tráiler
            </a>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          .animate-scan {
            animation: scan 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

export default EstrenoCard;
