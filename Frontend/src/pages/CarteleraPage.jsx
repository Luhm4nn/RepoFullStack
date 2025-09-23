import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPeliculas } from "../api/Peliculas.api";
import PeliculaCard from "../components/PeliculaCard";
import { formatDate } from "../utils/dateFormater";

function CarteleraPage() {
  const navigate = useNavigate();
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
    <div className="container mx-auto p-6 min-h-[100vh] flex flex-col">
      <h1 className="text-3xl font-bold text-white mb-4">Cartelera</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
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
  );
}

export default CarteleraPage;