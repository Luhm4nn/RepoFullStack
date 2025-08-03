import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import PeliculasList from "../components/PeliculasList";
import PeliculasForm from "../components/PeliculasForm";
import { createPelicula } from "../api/Peliculas.api";

function PeliculasPage() {
  const [refreshList, setRefreshList] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  
  const handleSubmit = async (values) => {
    try {
      console.log('📤 Enviando película:', values);
      await createPelicula(values);
      console.log('✅ Película creada exitosamente');
      
      // Cerrar modal y refrescar lista
      setOpenModal(false);
      setRefreshList(prev => prev + 1);
      
      // Mostrar mensaje de éxito
      alert('Película agregada exitosamente');
    } catch (error) {
      console.error('❌ Error al crear película:', error);
      alert('Error al agregar película');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl text-gray-200 font-bold">Gestión de Películas</h1>
        <span className="text-gray-300 mt-1 mb-5 block">
          Aquí puedes gestionar las películas del cine.
        </span>
        
        <div className="mb-6">
          <Button 
            onClick={() => setOpenModal(true)}
            className="!bg-gradient-to-r from-purple-700 to-blue-700 hover:!from-purple-600 hover:!to-blue-600 text-white"
          >
            ✨ Añadir Película +
          </Button>
        </div>

        <PeliculasList key={refreshList} />

        {/* Modal */}
        <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
          <Modal.Header>
            <span className="text-xl font-bold">Agregar Nueva Película</span>
          </Modal.Header>
          <Modal.Body>
            <PeliculasForm 
              onSubmit={handleSubmit} 
              onCancel={() => setOpenModal(false)} 
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default PeliculasPage;