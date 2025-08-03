import { useState } from "react";
import { Button } from "flowbite-react";
import SalasList from "../components/SalasList";
import SalasForm from "../components/SalasForm";
import { getSalas } from "../api/Salas.api";
import { createSala } from "../api/Salas.api";

function SalasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleSubmit = async (values) => {
    try {
      console.log('Enviando película:', values);
      await createSala(values);
      console.log('Sala creada exitosamente');
      
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1);
      
    } catch (error) {
      console.error('Error al crear sala:', error);
      alert('Error al agregar sala');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Salas</h1>
        <span className="text-gray-300 block mb-3 mt-1">
          Aquí puedes gestionar las salas de cine, incluyendo su ubicación y capacidad.</span>
        <div className="mb-6">
          <Button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4.5 mr-2.25">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    {mostrarFormulario ? "Cancelar" : "Añadir Sala"}
  </Button>
        </div>
        {mostrarFormulario && (
          <>
          {/*Fondo oscuro*/}
          <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMostrarFormulario(false)}
        ></div>
          
          {/* Formulario de Crear Sala */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      
              <SalasForm 
                onSubmit={(data) => {
                  handleSubmit(data);
                  setMostrarFormulario(false);
                }} 
              />
           
          </div>
        </div>
      </>
    )}

        <SalasList key={refreshList} />
      </div>
    </div>
  );
}

export default SalasPage;
