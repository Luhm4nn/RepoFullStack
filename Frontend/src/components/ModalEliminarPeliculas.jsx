import { useState } from "react";
import { Button } from "flowbite-react";
import { deletePelicula } from "../api/Peliculas.api";

function ModalEliminarPeliculas({ pelicula, onSuccess, onClose }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('Eliminando película:', pelicula.idPelicula);
      
      await deletePelicula(pelicula.idPelicula);
      
      console.log('Película eliminada exitosamente');
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error eliminando película:', error);
      alert('Error al eliminar película: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo difuminado */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />

      {/* Modal centrado */}
      <div className="relative bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            ¿Eliminar película?
          </h3>
          
          <p className="text-gray-300 mb-4">
            Esta acción no se puede deshacer. La película será eliminada permanentemente.
          </p>
          
          {/* Información de la película */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <h4 className="text-white font-semibold text-lg mb-2">
              🎬 {pelicula.nombrePelicula}
            </h4>
            <div className="text-gray-400 text-sm space-y-1">
              <p> <span className="font-medium">Director:</span> {pelicula.director}</p>
              <p> <span className="font-medium">Género:</span> {pelicula.generoPelicula}</p>
              <p> <span className="font-medium">Duración:</span> {pelicula.duracion} min</p>
              {pelicula.fechaEstreno && (
                <p> <span className="font-medium">Año:</span> {new Date(pelicula.fechaEstreno).getFullYear()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-center">
          <Button 
            type="button" 
            color="gray" 
            onClick={handleClose}
            disabled={isDeleting}
            className="px-6"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="!bg-red-600 hover:!bg-red-700 px-6"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              <>
                🗑️ Eliminar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarPeliculas;