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
          <TableRow className="!bg-slate-800/50 !text-white">
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Título</TableHeadCell>
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Género</TableHeadCell>
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">MPAA</TableHeadCell>
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Duración</TableHeadCell>
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Año</TableHeadCell>
          <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Acciones
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
              <TableRow key={pelicula.idPelicula} className="bg-slate-800/50 hover:!bg-white/10">
                <TableCell className="whitespace-nowrap font-medium !text-gray-200 ">
                  {pelicula.nombrePelicula || 'Sin título'}
                </TableCell>
                <TableCell>{pelicula.generoPelicula || 'Sin género'}</TableCell>
                <TableCell>{pelicula.mpaa || 'Sin clasificación'}</TableCell>
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