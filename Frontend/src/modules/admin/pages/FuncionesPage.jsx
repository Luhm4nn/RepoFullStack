import { useState } from "react";
import { Button, Modal, ModalBody } from "flowbite-react";
import { FuncionesList, FuncionesForm, createFuncion } from "../../admin";
import { ErrorModal, useErrorModal } from "../../shared";

function FuncionesPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const { error, handleApiError, hideError } = useErrorModal();

  const handleSubmit = async (values) => {
    try {
      await createFuncion(values);
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1);
    } catch (error) {
      // Usar el hook para manejar errores de validación
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        // Si no fue un error de validación, mostrar alert tradicional
        const errorMessage = error.response?.data?.message || error.message;
        alert(`Error al crear función: ${errorMessage}`);
      }
    }
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    hideError();
  };

  const openFormulario = () => {
    hideError();
    setMostrarFormulario(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Funciones</h1>
        <span className="text-gray-300 block mb-3 mt-1">
          Aquí puedes gestionar las funciones de cine, programar películas en salas y horarios.
        </span>
        
        <div className="mb-6">
          <Button 
            onClick={openFormulario}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2.5" 
              stroke="currentColor" 
              className="size-4.5 mr-2.25"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir Función
          </Button>
        </div>

        {/* Modal para Crear Función */}
        <Modal show={mostrarFormulario} onClose={closeModal} size="xl"
        theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}>
          <ModalBody className="p-0">
            <FuncionesForm 
              onSubmit={(data) => {
                handleSubmit(data);
              }} 
            />
          </ModalBody>
        </Modal>

        <FuncionesList key={refreshList} />

        {/* Modal de Error Unificado */}
        <ErrorModal error={error} onClose={hideError} />
      </div>
    </div>
  );
}

export default FuncionesPage;