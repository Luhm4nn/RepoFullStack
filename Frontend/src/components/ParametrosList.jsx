import { getParametros, createParametro, updateParametro, deleteParametro } from "../api/Parametros.api";
import { Card, Button, Modal, ModalBody, ModalHeader, } from "flowbite-react";
import { useEffect, useState } from "react";
import ParametrosForm from "./ParametroForm";
import ParametroDelete from "./ParametroDelete";




function ParametrosList({ onAddClick }) {
  const [parametros, setParametros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [parametroEditar, setParametroEditar] = useState(null);
  const [mostrarDeleteModal, setMostrarDeleteModal] = useState(false);
  const [parametroAEliminar, setParametroAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParametros();
  }, []);

  const fetchParametros = async () => {
    try {
      setLoading(true);
      const data = await getParametros();
      setParametros(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching parametros:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (data) => {
    try {
      if (parametroEditar) {
        
        await updateParametro(parametroEditar.idParametro, data);
      } else {
        
        await createParametro(data);
      }
     
      await fetchParametros();
      closeModal();
    } catch (error) {
      console.error("Error saving parametro:", error);
      
    }
  };

  
  const openModal = () => {
    setParametroEditar(null);
    setMostrarFormulario(true);
  };

 
  const openEditModal = (parametro) => {
    setParametroEditar(parametro);
    setMostrarFormulario(true);
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    setParametroEditar(null);
  };

 
  const openDeleteModal = (parametro) => {
    // Proteger los primeros dos registros (IDs 1 y 2)
    if (parametro.idParametro <= 2) {
      alert("No se puede eliminar este parámetro del sistema.");
      return;
    }
    setParametroAEliminar(parametro);
    setMostrarDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!eliminando) {
      setMostrarDeleteModal(false);
      setParametroAEliminar(null);
    }
  };


  const confirmDelete = async () => {
    if (!parametroAEliminar) return;
    
    try {
      setEliminando(true);
      await deleteParametro(parametroAEliminar.idParametro);
      await fetchParametros();
      setMostrarDeleteModal(false);
      setParametroAEliminar(null);
    } catch (error) {
      console.error("Error deleting parametro:", error);
      alert("Error al eliminar el parámetro.");
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-white">Cargando Parámetros...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Parámetros cargados.</p>
        <button 
          onClick={fetchParametros} 
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
          <ParametrosForm 
            onSubmit={handleSubmit}
            onCancel={closeModal}
            initialData={parametroEditar}
            isEditing={!!parametroEditar}
          />
        </ModalBody>
      </Modal>

      {/* Modal de confirmación de eliminación */}
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
          {parametroAEliminar && (
            <ParametroDelete
              parametro={parametroAEliminar}
              onConfirm={confirmDelete}
              onCancel={closeDeleteModal}
              isDeleting={eliminando}
            />
          )}
        </ModalBody>
      </Modal>

      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Parámetros</h3>
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
              Nuevo
            </Button>
          </div>
          
          <div className="space-y-4">
            {parametros.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay parámetros registrados
              </div>
            ) : (
              parametros.map((param) => (
                <div key={param.idParametro} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        {param.descripcionParametro || 'Sin descripción'}
                      </h4>
                      <p className="text-2xl font-bold text-purple-400">
                        {param.valor || '0'}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {/* Botón Editar */}
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                        onClick={() => openEditModal(param)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </Button>
                      
                      {/* Botón Eliminar - Solo si no es uno de los primeros dos */}
                      {param.idParametro > 2 && (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                          onClick={() => openDeleteModal(param)}
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

export default ParametrosList;