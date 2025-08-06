import { getPeliculas } from "../api/Peliculas.api";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { useEffect, useState } from "react";

function PeliculasList() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const data = await getPeliculas();
        setPeliculas(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching peliculas:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando películas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Título</TableHeadCell>
            <TableHeadCell>Director</TableHeadCell>
            <TableHeadCell>Género</TableHeadCell>
            <TableHeadCell>Duración</TableHeadCell>
            <TableHeadCell>Año</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Acciones</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {peliculas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No hay películas registradas
              </TableCell>
            </TableRow>
          ) : (
            peliculas.map((pelicula) => (
              <TableRow key={pelicula.idPelicula} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {pelicula.nombrePelicula || 'Sin título'}
                </TableCell>
                <TableCell>{pelicula.director || 'Sin director'}</TableCell>
                <TableCell>{pelicula.generoPelicula || 'Sin género'}</TableCell>
                <TableCell>{pelicula.duracion ? `${pelicula.duracion} min` : 'N/A'}</TableCell>
                <TableCell>
                  {pelicula.fechaEstreno && pelicula.fechaEstreno !== null ? 
                    new Date(pelicula.fechaEstreno).getFullYear() : 
                    'Sin fecha'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" color="blue">
                      Editar
                    </Button>
                    <Button size="xs" color="red">
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PeliculasList;