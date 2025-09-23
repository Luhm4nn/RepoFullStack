import { useEffect, useState } from "react";
import { getPeliculas } from "../api/Peliculas.api";
import { Button } from "flowbite-react";
import { formatDate } from "../utils/dateFormater";

function CarteleraPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeliculas()
      .then(setPeliculas)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-white text-lg">Cargando cartelera...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Cartelera</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {peliculas.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No hay películas en cartelera.
          </div>
        ) : (
          peliculas.map((pelicula) => (
            <div
              key={pelicula.idPelicula}
              className="bg-slate-800/60 rounded-xl border border-slate-700 p-4 flex flex-col shadow-lg"
            >
              <div className="flex-1">
                <div className="h-48 w-full bg-slate-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {pelicula.portada ? (
                    <img
                      src={pelicula.portada}
                      alt={pelicula.nombrePelicula}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{pelicula.nombrePelicula}</h2>
                <div className="text-gray-300 text-sm mb-1">{pelicula.generoPelicula}</div>
                <div className="text-gray-400 text-xs mb-2">
                  {pelicula.duracion ? `${pelicula.duracion} min` : "Duración N/D"}
                  {" · "}
                  {pelicula.fechaEstreno ? formatDate(pelicula.fechaEstreno) : "Sin fecha"}
                </div>
                <div className="text-gray-400 text-xs mb-2">{pelicula.sinopsis?.slice(0, 80)}...</div>
              </div>
              <Button
                className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => window.location.href = `/pelicula/${pelicula.idPelicula}`}
              >
                Ver detalles
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CarteleraPage;