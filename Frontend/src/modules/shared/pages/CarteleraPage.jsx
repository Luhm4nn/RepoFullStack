import { PeliculaCard } from "../../shared";
import { useEffect, useState } from "react";
import { getPeliculasEnCartelera } from "../../user";
import { CarouselSkeleton } from "../components/Skeleton";

function CarteleraPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSynopsis, setExpandedSynopsis] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getPeliculasEnCartelera().then((data) => {
      setPeliculas(data);
      setLoading(false);
    });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (peliculas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % peliculas.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [peliculas.length]);

  const toggleSynopsis = (id) => {
    setExpandedSynopsis((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % peliculas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + peliculas.length) % peliculas.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-12 md:py-20 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 md:mb-8 text-center drop-shadow-2xl">
          ¡Bienvenido a <span className="text-purple-400">Cutzy Cinema</span>!
        </h1>
        <p className="text-lg sm:text-xl md:text-3xl text-gray-200 mb-8 md:mb-12 text-center max-w-3xl px-4">
          Tu lugar para vivir la mejor experiencia de cine. Disfruta de los
          últimos estrenos, reserva tus asientos y sumérgete en la magia del
          séptimo arte.
        </p>

        {/* Carousel estilo pantalla de cine */}
        <div className="w-full max-w-7xl mb-12 relative">
          {/* Decoración: Barras superiores estilo cine */}
          <div className="absolute -top-6 left-4 right-4 md:left-0 md:right-0 flex justify-center gap-2 z-0">
            <div className="h-1 flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
            <div className="h-1 flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
            <div className="h-1 flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[400px] md:h-[550px] rounded-xl bg-slate-800/50 border border-slate-700">
              <CarouselSkeleton />
            </div>
          ) : peliculas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-gray-400 text-xl md:text-2xl">
                No hay películas en cartelera.
              </span>
            </div>
          ) : (
            <div className="relative">
              {/* Marco decorativo estilo cine */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-xl opacity-75 blur-sm"></div>

              {/* Carousel container */}
              <div className="relative h-[400px] md:h-[550px] rounded-xl overflow-hidden bg-black border-2 md:border-4 border-slate-900">
                {/* Slides */}
                <div className="relative h-full w-full">
                  {peliculas.map((pelicula, index) => (
                    <div
                      key={pelicula.idPelicula}
                      className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                        index === currentSlide
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0"
                      }`}
                    >
                      <div className="relative h-full flex items-center justify-center bg-black overflow-hidden">
                        {/* Fondo con doble capa para efecto cinematográfico */}
                        <div className="absolute inset-0">
                          {/* Capa 1: Imagen principal */}
                          <img
                            src={pelicula.portada || "/placeholder.svg"}
                            alt={pelicula.nombrePelicula}
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: "center 30%",
                              filter: "brightness(0.7) contrast(1.1)",
                            }}
                          />

                          {/* Capa 2: Overlay con gradiente cinematográfico */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
                        </div>

                        {/* Contenido responsive */}
                        <div className="relative z-10 w-full h-full flex flex-col justify-center md:justify-between px-4 sm:px-6 md:px-12 py-8 md:py-0 md:flex-row md:items-center gap-4 md:gap-8">
                          {/* Información principal */}
                          <div className="flex-1 space-y-2 md:space-y-4 max-w-2xl flex flex-col justify-center">
                            {/* Badge de género con efecto neón */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="relative px-3 py-1.5 md:px-4 md:py-2 bg-purple-600/30 backdrop-blur-sm border border-purple-400/50 rounded-lg text-purple-200 text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg shadow-purple-500/20">
                                {pelicula.generoPelicula}
                              </span>
                              {pelicula.MPAA && (
                                <span className="px-2 py-1 md:px-3 md:py-1 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded text-gray-300 text-xs font-semibold">
                                  {pelicula.MPAA}
                                </span>
                              )}
                              {pelicula.duracion && (
                                <span className="px-2 py-1 md:px-3 md:py-1 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded text-gray-300 text-xs font-semibold">
                                  {pelicula.duracion} min
                                </span>
                              )}
                            </div>

                            {/* Título responsive */}
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight line-clamp-2 md:line-clamp-3">
                              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                                {pelicula.nombrePelicula}
                              </span>
                            </h2>

                            {/* Sinopsis con toggle */}
                            <div className="relative">
                              <p
                                className={`text-gray-200 text-xs sm:text-sm md:text-lg leading-relaxed drop-shadow-lg ${
                                  expandedSynopsis[pelicula.idPelicula]
                                    ? ""
                                    : "line-clamp-2 md:line-clamp-3"
                                }`}
                              >
                                {pelicula.sinopsis ||
                                  "Sin sinopsis disponible."}
                              </p>
                              {pelicula.sinopsis &&
                                pelicula.sinopsis.length > 100 && (
                                  <button
                                    onClick={() =>
                                      toggleSynopsis(pelicula.idPelicula)
                                    }
                                    className="mt-1 text-purple-300 hover:text-purple-200 text-xs md:text-sm font-semibold underline transition-colors"
                                  >
                                    {expandedSynopsis[pelicula.idPelicula]
                                      ? "Ver menos"
                                      : "Ver más"}
                                  </button>
                                )}
                            </div>

                            {/* Botones de acción responsive */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-1 md:pt-4">
                              <a
                                href={`/reservar/${pelicula.idPelicula}`}
                                className="group relative px-5 md:px-8 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-white text-xs sm:text-sm md:text-base shadow-xl shadow-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 text-center"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Reservar
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </a>

                              {pelicula.trailerURL && (
                                <a
                                  href={pelicula.trailerURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-lg font-semibold text-white text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                  Trailer
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Poster decorativo (solo desktop) */}
                          <div className="hidden lg:block relative group">
                            <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-50 group-hover:opacity-75 blur-xl transition-opacity duration-300"></div>
                            <img
                              src={pelicula.portada || "/placeholder.svg"}
                              alt={pelicula.nombrePelicula}
                              className="relative h-72 w-auto rounded-lg shadow-2xl border-2 border-white/20 transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </div>

                        {/* Efecto de película: línea de escaneo sutil */}
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scan"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controles personalizados abajo a la derecha */}
                <div className="absolute bottom-4 right-4 flex items-center gap-3 z-40">
                  {/* Barra de progreso horizontal */}
                  <div className="hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                    {peliculas.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          index === currentSlide
                            ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500"
                            : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Botones de navegación */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-2 border-white/40 transition-all duration-300 shadow-xl shadow-purple-500/50 hover:scale-110 cursor-pointer"
                      aria-label="Anterior"
                    >
                      <svg
                        className="h-5 w-5 md:h-6 md:w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-2 border-white/40 transition-all duration-300 shadow-xl shadow-purple-500/50 hover:scale-110 cursor-pointer"
                      aria-label="Siguiente"
                    >
                      <svg
                        className="h-5 w-5 md:h-6 md:w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decoración: Barra inferior con gradiente elegante - FUERA del carousel */}
          <div className="absolute -bottom-6 left-4 right-4 md:left-0 md:right-0 flex justify-center z-0">
            <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40 blur-md"></div>
              <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 blur-lg"></div>
            </div>
          </div>
        </div>

        <div className="mb-8 md:mb-12 mt-8">
          <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 text-center px-4">
            Descubre qué te espera en nuestra cartelera...
          </h3>
        </div>

        {/* Cartelera grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {peliculas.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">
              No hay películas en cartelera.
            </div>
          ) : (
            peliculas.map((pelicula) => (
              <PeliculaCard key={pelicula.idPelicula} pelicula={pelicula} />
            ))
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

export default CarteleraPage;
