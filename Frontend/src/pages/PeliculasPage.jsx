import { useState } from "react";
import { Button } from "flowbite-react";
import PeliculasList from "../components/PeliculasList";
import PeliculasForm from "../components/PeliculasForm";
import { createPelicula } from "../api/Peliculas.api";

function PeliculasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleSubmit = async (values) => {
    try {
      console.log('📤 Enviando película:', values);
      await createPelicula(values);
      console.log('✅ Película creada exitosamente');
      
      // Cerrar formulario y refrescar lista
      setMostrarFormulario(false);
      setRefreshList(prev => prev + 1); // Trigger refresh en PeliculasList
      
      // Mostrar mensaje de éxito (opcional)
      alert('Película agregada exitosamente');
    } catch (error) {
      console.error('❌ Error al crear película:', error);
      alert('Error al agregar película');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión de Películas</h1>
        
        <div className="mb-6">
          <Button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className={`${mostrarFormulario 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
    }`}
  >
    {mostrarFormulario ? "Cancelar" : "Añadir Película"}
  </Button>
        </div>

        {mostrarFormulario && (
          <div className="mb-6">
            <PeliculasForm onSubmit={handleSubmit} />
          </div>
        )}

        <PeliculasList key={refreshList} />
      </div>
    </div>
  );
}

export default PeliculasPage;
