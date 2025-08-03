import { getSalas } from "../api/Salas.api";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { useEffect, useState } from "react";

function SalasList() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const data = await getSalas();
        setSalas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching salas:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando Salas...</div>;
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
          <TableRow className="bg-slate-800/50 text-white pointer-events-none border-slate-700">
            <TableHeadCell className="bg-slate-800/50 text-white">Sala</TableHeadCell>
            <TableHeadCell className="bg-slate-800/50 text-white">Ubicación</TableHeadCell>
            <TableHeadCell className="bg-slate-800/50 text-white">Capacidad</TableHeadCell>
            <TableHeadCell className="bg-slate-800/50 text-white">Acciones</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {salas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No hay salas registradas
              </TableCell>
            </TableRow>
          ) : (
            salas.map((sala) => (
              <TableRow key={sala.idSala} className="bg-slate-800/50 hover:bg-white/10 text-gray-300 border-slate-700">
                <TableCell className="whitespace-nowrap font-medium text-white">
                  {sala.idSala || 'Sin ID'}
                </TableCell>
                <TableCell>{sala.ubicacion || 'Sin ubicación'}</TableCell>
               <TableCell>
                  {sala.filas && sala.asientosPorFila
                  ? `${sala.filas * sala.asientosPorFila} Asientos (${sala.filas} x ${sala.asientosPorFila})`
                  : 'Sin capacidad'}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" color="blue" >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Editar
                    </Button>
                    <Button size="sm" color="red" >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1">
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
  );
}

export default SalasList;