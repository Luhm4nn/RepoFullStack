import { useState } from "react";
import { Button, Modal, ModalBody } from "flowbite-react";
import FuncionesList from "../components/Funciones/FuncionesList";
import FuncionesForm from "../components/Funciones/FuncionesForm";
import { createFuncion } from "../api/Funciones.api";

function FuncionesPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const handleSubmit = async (values) => {
    try {
      await createFuncion(values);
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1);
      
    } catch (error) {
      console.error('Error al crear función:', error);
      
      // Verificar si es error de solapamiento
      const errorCode = error.response?.data?.errorCode;
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorCode === "SOLAPAMIENTO_FUNCIONES") {
        setMensajeError(errorMessage);
        setMostrarModalError(true);
      } else {
        alert(`Error al crear función: ${errorMessage}`);
      }
    }
  };

  const closeModal = () => {
    setMostrarFormulario(false);
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
            onClick={() => setMostrarFormulario(true)}
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

        {/* Modal de Error para Solapamientos */}
        <Modal 
          show={mostrarModalError} 
          onClose={() => setMostrarModalError(false)}
          size="md"
          theme={{
            content: {
              base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
              inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
            }
          }}
        >
          <ModalBody className="p-0">
            <div className="bg-slate-800 border-slate-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-orange-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                 Conflicto de Horarios
              </h2>
              <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-gray-300 text-center text-sm">
                  {mensajeError}
                </p>
              </div>
              <p className="mb-5 text-sm text-gray-300 text-center">
                Por favor, selecciona un horario diferente que no se solape con otras funciones.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => setMostrarModalError(false)}
                  className="w-full sm:w-auto text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
                >
                  Entendido
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

export default FuncionesPage;