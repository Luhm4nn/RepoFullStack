import { useState } from "react";
import { Button } from "flowbite-react";
import SalasList from "../components/SalasList";
//import SalasForm
import { getSalas } from "../api/Salas.api";

function SalasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleSubmit = async (values) => {
    try {
      console.log('Enviando película:', values);
      //await createPelicula(values);
      console.log('Película creada exitosamente');
      
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1);
      
      alert('Sala agregada exitosamente');
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
          className={`${mostrarFormulario 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
    }`}
  >
    {mostrarFormulario ? "Cancelar" : "Añadir Sala"}
  </Button>
        </div>
        {mostrarFormulario && (
          <div className="mb-6">
            <SalasForm onSubmit={handleSubmit} />
          </div>
        )}

        <SalasList key={refreshList} />
      </div>
    </div>
  );
}

export default SalasPage;
