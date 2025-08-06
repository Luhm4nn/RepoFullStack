import { getPeliculas } from "../api/Peliculas.api";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import ModalPeliculas from "./ModalPeliculas";
import ModalEliminarPeliculas from "./ModalEliminarPeliculas";

function PeliculasList({ refreshTrigger }) {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [peliculaToEdit, setPeliculaToEdit] = useState(null);

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
  }, [refreshTrigger]);

  const handleEdit = (pelicula) => {
    console.log('Editando película:', pelicula);
    setPeliculaToEdit(pelicula);
  };

  const handleCloseEdit = () => {
    setPeliculaToEdit(null);
  };

  const handleDelete = (pelicula) => {
    console.log('Preparando eliminar película:', pelicula);
    setPeliculaToDelete(pelicula);
  };

  const handleCloseDelete = () => {
    setPeliculaToDelete(null);
  };

  const handleRefresh = () => {
    // Refrescar la lista después de eliminar
    const fetchPeliculas = async () => {
      try {
        const data = await getPeliculas();
        setPeliculas(data);
      } catch (error) {
        console.error("Error refreshing peliculas:", error);
      }
    };
    fetchPeliculas();
    setPeliculaToEdit(null);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      // Aquí implementarías la funcionalidad de eliminar
      console.log('Eliminar película con ID:', id);
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-gray-200">Cargando películas...</div>;
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
    <>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow className="!bg-slate-800/50 !text-white">
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Título</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Director</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Género</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">MPAA</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Duración</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Año</TableHeadCell>
              <TableHeadCell className="!bg-slate-800/50 !text-white !border-slate-700">Acciones</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {peliculas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-200">
                  No hay películas registradas
                </TableCell>
              </TableRow>
            ) : (
              peliculas.map((pelicula) => (
                <TableRow key={pelicula.idPelicula} className="bg-slate-800/50 hover:!bg-white/10">
                  <TableCell className="whitespace-nowrap font-medium !text-gray-200">
                    {pelicula.nombrePelicula || 'Sin título'}
                  </TableCell>
                  <TableCell className="!text-gray-200">{pelicula.director || 'Sin director'}</TableCell>
                  <TableCell className="!text-gray-200">{pelicula.generoPelicula || 'Sin género'}</TableCell>
                  <TableCell className="!text-gray-200">{pelicula.MPAA || 'Sin clasificación'}</TableCell>
                  <TableCell className="!text-gray-200">{pelicula.duracion ? `${pelicula.duracion} min` : 'N/A'}</TableCell>
                  <TableCell className="!text-gray-200">
                    {pelicula.fechaEstreno && pelicula.fechaEstreno !== null ? 
                      new Date(pelicula.fechaEstreno).getFullYear() : 
                      'Sin fecha'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleEdit(pelicula)} 
                        size="xs" 
                        className="!bg-blue-600 hover:!bg-blue-700"
                      >
                        ✏️ Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(pelicula.idPelicula)} 
                        size="xs" 
                        className="!bg-red-600 hover:!bg-red-700"
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de edición */}
      {peliculaToEdit && (
        <ModalPeliculas 
          peliculaToEdit={peliculaToEdit}
          onSuccess={handleEditSuccess}
          onClose={handleCloseEdit}
        />
      )}

      {/* Modal de eliminación */}
      {peliculaToDelete && (
        <ModalEliminarPeliculas 
          pelicula={peliculaToDelete}
          onSuccess={handleRefresh}
          onClose={handleCloseDelete}
        />
      )}
    </>
  );
}

export default PeliculasList;