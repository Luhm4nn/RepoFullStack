import { getPeliculas } from "../../../api/Peliculas.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { formatDate } from "../../shared";
import ModalPeliculas from "./ModalPeliculas";
import ModalDeletePeliculas from "./ModalDeletePeliculas";

function PeliculasList({ refreshTrigger }) {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [peliculaToEdit, setPeliculaToEdit] = useState(null);
  const [peliculaToDelete, setPeliculaToDelete] = useState(null);

  useEffect(() => {
    fetchPeliculas();
  }, [refreshTrigger]);

  const fetchPeliculas = async () => {
    try {
      setLoading(true);
      const data = await getPeliculas();
      setPeliculas(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching peliculas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pelicula) => {
    setPeliculaToEdit(pelicula);
  };

  const handleCloseEdit = () => {
    setPeliculaToEdit(null);
  };

  const handleDelete = (pelicula) => {
    setPeliculaToDelete(pelicula);
  };

  const handleCloseDelete = () => {
    setPeliculaToDelete(null);
  };

  const handleEditSuccess = () => {
    fetchPeliculas();
    setPeliculaToEdit(null);
  };

  const handleRefresh = () => {
    fetchPeliculas();
    setPeliculaToDelete(null);
  };

  if (loading) {
    return <div className="text-center p-4">Cargando Películas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Películas cargadas.</p>
        <button
          onClick={fetchPeliculas}
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vista escritorio */}
      <div className="hidden md:block overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow className="bg-slate-800/50 text-white pointer-events-none border-slate-700">
              <TableHeadCell className="bg-slate-800/50 text-white">Título</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Director</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Género</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">MPAA</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Duración</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Estreno</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Acciones</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {peliculas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay películas registradas
                </TableCell>
              </TableRow>
            ) : (
              peliculas.map((pelicula) => (
                <TableRow
                  key={pelicula.idPelicula}
                  className="bg-slate-800/50 hover:bg-white/10 text-gray-300 border-slate-700"
                >
                  <TableCell className="whitespace-nowrap font-medium text-white">
                    {pelicula.nombrePelicula || "Sin título"}
                  </TableCell>
                  <TableCell>{pelicula.director || "Sin director"}</TableCell>
                  <TableCell>{pelicula.generoPelicula || "Sin género"}</TableCell>
                  <TableCell>{pelicula.MPAA || "Sin clasificación"}</TableCell>
                  <TableCell>
                    {pelicula.duracion ? `${pelicula.duracion} min` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {pelicula.fechaEstreno
                      ? formatDate(pelicula.fechaEstreno)
                      : "Sin fecha"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                        onClick={() => handleEdit(pelicula)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                        onClick={() => handleDelete(pelicula)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
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

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {peliculas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No hay películas registradas
          </div>
        ) : (
          peliculas.map((pelicula) => (
            <div
              key={pelicula.idPelicula}
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3Z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white text-sm">
                    {pelicula.nombrePelicula || "Sin título"}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {pelicula.director || "Sin director"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.954-4.477a.75.75 0 0 0-.692 0L2.25 7.5m18 0v9a.75.75 0 0 1-.75.75h-4.5m5.25-9L12 12.75m0 0L3.75 7.5m8.25 5.25v9" />
                  </svg>
                  <span>{pelicula.generoPelicula || "Sin género"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  <span>{pelicula.MPAA || "Sin clasificación"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{pelicula.duracion ? `${pelicula.duracion} min` : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75" />
                  </svg>
                  <span>
                    {pelicula.fechaEstreno
                      ? formatDate(pelicula.fechaEstreno)
                      : "Sin fecha"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                  onClick={() => handleEdit(pelicula)}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                  Editar Película
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                  onClick={() => handleDelete(pelicula)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Eliminar Película
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal edición */}
      {peliculaToEdit && (
        <ModalPeliculas
          peliculaToEdit={peliculaToEdit}
          onSuccess={handleEditSuccess}
          onClose={handleCloseEdit}
        />
      )}

      {/* Modal eliminación */}
      {peliculaToDelete && (
        <ModalDeletePeliculas
          pelicula={peliculaToDelete}
          onSuccess={handleRefresh}
          onClose={handleCloseDelete}
        />
      )}
    </div>
  );
}

export default PeliculasList;
export { PeliculasList };
