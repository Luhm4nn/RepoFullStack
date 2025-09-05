import { getTarifas, createTarifa, updateTarifa, deleteTarifa } from "../../api/Tarifas.api";
import { Card, Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dateFormater";
import { formatearPrecio } from "../../utils/formatearPrecio";
import TarifaForm from "./TarifaForm";
import TarifaDelete from "./TarifaDelete";

function TarifasList() {
  const [tarifas, setTarifas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tarifaEditar, setTarifaEditar] = useState(null);
  const [mostrarDeleteModal, setMostrarDeleteModal] = useState(false);
  const [tarifaAEliminar, setTarifaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTarifas();
  }, []);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const data = await getTarifas();
      setTarifas(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tarifas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (data) => {
    try {
      if (tarifaEditar) {
        // Editar tarifa existente
        await updateTarifa(tarifaEditar.idTarifa, data);
      } else {
        // Crear nueva tarifa
        await createTarifa(data);
      }
      // Recargar la lista después de crear/editar
      await fetchTarifas();
      closeModal();
    } catch (error) {
      console.error("Error saving tarifa:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Función para abrir el modal para crear
  const openModal = () => {
    setTarifaEditar(null);
    setMostrarFormulario(true);
  };

  // Función para abrir el modal para editar
  const openEditModal = (tarifa) => {
    setTarifaEditar(tarifa);
    setMostrarFormulario(true);
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    setTarifaEditar(null);
  };

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (tarifa) => {
    // Proteger las primeras dos tarifas (IDs 1 y 2)
    if (tarifa.idTarifa <= 2) {
      alert("No se puede eliminar esta tarifa del sistema.");
      return;
    }
    setTarifaAEliminar(tarifa);
    setMostrarDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!eliminando) {
      setMostrarDeleteModal(false);
      setTarifaAEliminar(null);
    }
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (!tarifaAEliminar) return;
    
    try {
      setEliminando(true);
      await deleteTarifa(tarifaAEliminar.idTarifa);
      await fetchTarifas();
      setMostrarDeleteModal(false);
      setTarifaAEliminar(null);
    } catch (error) {
      console.error("Error deleting tarifa:", error);
      alert("Error al eliminar la tarifa.");
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-white">Cargando Tarifas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Tarifas cargadas.</p>
        <button 
          onClick={fetchTarifas} 
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700 text-white rounded transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Modal de formulario */}
      <Modal
        show={mostrarFormulario}
        onClose={closeModal}
        size="xl"
        theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}
      >
        <ModalBody className="p-0">
          <TarifaForm 
            onSubmit={handleSubmit}
            onCancel={closeModal}
            initialData={tarifaEditar}
            isEditing={!!tarifaEditar}
          />
        </ModalBody>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      {tarifaAEliminar && (
        <Modal
          show={mostrarDeleteModal}
          onClose={closeDeleteModal}
          size="md"
          theme={{
            content: {
              base: "relative h-full w-full p-4 flex items-center justify-center",
              inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
            }
          }}
        >
          <ModalBody className="p-0">
            <TarifaDelete
              tarifa={tarifaAEliminar}
              onConfirm={confirmDelete}
              onCancel={closeDeleteModal}
              isDeleting={eliminando}
            />
          </ModalBody>
        </Modal>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Tarifas</h3>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={openModal}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2.5" 
                stroke="currentColor" 
                className="w-4 h-4 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nueva
            </Button>
          </div>
          
          <div className="space-y-4">
            {tarifas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay tarifas registradas
              </div>
            ) : (
              tarifas.map((tar) => (
                <div key={tar.idTarifa} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        {tar.descripcionTarifa || 'Sin descripción'}
                      </h4>
                      <p className="text-2xl font-bold text-green-400">
                        {formatearPrecio(tar.precio)}
                      </p>
                      <span className="text-xs text-gray-400">
                        {"Fecha de Vigencia: " + formatDate(tar.fechaDesde)}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {/* Botón Editar */}
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                        onClick={() => openEditModal(tar)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </Button>
                      
                      {/* Botón Eliminar - Solo si no es una de las primeras dos */}
                      {tar.idTarifa > 2 && (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                          onClick={() => openDeleteModal(tar)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TarifasList;