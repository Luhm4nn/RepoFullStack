import { getSalas, updateSala, deleteSala, getAsientosBySala } from "../../../api/Salas.api.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";



import { useEffect, useState } from "react";
import SalasEditForm from "./SalasEditForm";
import SalaDelete from "./SalaDelete";

function SalasList() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingModal, setEditingModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [salaToDelete, setSalaToDelete] = useState(null);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas();
      data.sort((a, b) => 
      a.nombreSala.localeCompare(b.nombreSala)
    );
      setSalas(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sala) => {
    setSelectedSala(sala);
    setEditingModal(true);
  };

  const handleEditSubmit = async (data, salaId) => {
    try {
      await updateSala(salaId, data);
      setEditingModal(false);
      setSelectedSala(null);
      await fetchSalas();
    } catch (error) {
      alert("Error al actualizar la sala: " + error.message);
    }
  };

  const handleDelete = (sala) => {
    setSalaToDelete(sala);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSala(salaToDelete.idSala);
      setDeleteModal(false);
      setSalaToDelete(null);
      await fetchSalas();
    } catch (error) {
      alert("Error al eliminar la sala: " + error.message);
    }
  };

  const closeEditModal = () => {
    setEditingModal(false);
    setSelectedSala(null);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSalaToDelete(null);
  };

  if (loading) {
    return <div className="text-center p-4">Cargando Salas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Salas cargadas.</p>
        <button 
          onClick={fetchSalas} 
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700 text-white rounded transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Modal show={editingModal} onClose={closeEditModal} size="4xl"
      theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}>
        <ModalBody className="p-0 rounded-lg">
          {selectedSala && (
            <SalasEditForm
              sala={selectedSala}
              onSubmit={handleEditSubmit}
              onCancel={closeEditModal}
            />
          )}
        </ModalBody>
      </Modal>

      <Modal show={deleteModal} onClose={closeDeleteModal} size="sm"
      theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}>
        <ModalBody className="p-0">
          <SalaDelete
            sala={salaToDelete}
            onConfirm={confirmDelete}
            onCancel={closeDeleteModal}
          />
        </ModalBody>
      </Modal>


      <div className="hidden md:block overflow-x-auto">
        <Table>
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
                <TableCell colSpan={4} className="text-center py-4">
                  No hay salas registradas
                </TableCell>
              </TableRow>
            ) : (
              salas.map((sala) => (
                <TableRow key={sala.nombreSala} className="bg-slate-800/50 hover:bg-white/10 text-gray-300 border-slate-700">
                  <TableCell className="whitespace-nowrap font-medium text-white">
                    {sala.nombreSala || 'Sin Nombre'}
                  </TableCell>
                  <TableCell>{sala.ubicacion || 'Sin ubicación'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                      <span>
                        {sala.filas && sala.asientosPorFila
                          ? `${sala.filas * sala.asientosPorFila} Asientos (${sala.filas} x ${sala.asientosPorFila})`
                          : 'Sin capacidad'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                        onClick={() => handleEdit(sala)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                        onClick={() => handleDelete(sala)}
                      >
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

      {/* Responsive view para mobile */}
      <div className="md:hidden space-y-4">
        {salas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No hay salas registradas
          </div>
        ) : (
          salas.map((sala) => (
            <div key={sala.nombreSala} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {sala.nombreSala.substring(0, 3) || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      Sala {sala.nombreSala || 'Sin nombre'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {sala.ubicacion || 'Sin ubicación'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <span>
                  {sala.filas && sala.asientosPorFila
                    ? `${sala.filas * sala.asientosPorFila} asientos (${sala.filas} x ${sala.asientosPorFila})`
                    : 'Sin capacidad'}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                  onClick={() => handleEdit(sala)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Editar Sala
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                  onClick={() => handleDelete(sala)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Eliminar Sala
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SalasList;
export { SalasList };