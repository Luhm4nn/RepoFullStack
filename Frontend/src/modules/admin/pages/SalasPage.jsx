import { useState } from "react";
import { Button, Modal, ModalBody } from "flowbite-react";
import SalasList from "../components/SalasList.jsx";
import SalasForm from "../components/SalasForm.jsx";
import { createSala } from "../../../api/Salas.api.js";
import { useNotification } from '../../../context/NotificationContext';

function SalasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const notify = useNotification();

  const handleSubmit = async (values) => {
    try {
      await createSala(values);
      notify.success('Sala creada exitosamente');
      
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al agregar sala';
      notify.error(`Error al agregar sala: ${errorMsg}`);
    }
  };

  const closeModal = () => {
    setMostrarFormulario(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Salas</h1>
        <span className="text-gray-300 block mb-3 mt-1">
          Aquí puedes gestionar las salas de cine, incluyendo su ubicación y tipos de asientos.
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
            Añadir Sala
          </Button>
        </div>

        {/* Modal para Crear Sala */}
        <Modal show={mostrarFormulario} onClose={closeModal} size="xl"
        theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}>
          <ModalBody className="p-0">
            <SalasForm 
              onSubmit={(data) => {
                handleSubmit(data);
              }} 
            />
          </ModalBody>
        </Modal>

        <SalasList key={refreshList} />
      </div>
    </div>
  );
}

export default SalasPage;