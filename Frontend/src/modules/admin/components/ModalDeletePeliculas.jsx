import { Button } from "flowbite-react";

function ModalDeletePeliculas({ pelicula, onSuccess, onClose, isDeleting = false }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50 ">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full mx-4 relative">
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
          Eliminar Película
        </h2>
        <h3 className="mb-6 text-base sm:text-lg font-normal text-white text-center px-4">
          ¿Estás seguro de que quieres eliminar esta película?
        </h3>

        <div className="mb-6 p-5 bg-slate-700/50 rounded-lg mx-auto">
          <p className="text-white font-medium text-center mb-3">
            "{pelicula.nombrePelicula}"
          </p>
          <div className="space-y-3">
            <p className="text-gray-300 text-center text-sm">
              Director: <span className="font-semibold text-purple-400">{pelicula.director}</span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Género: <span className="font-semibold text-purple-400">{pelicula.generoPelicula}</span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Duración: <span className="font-semibold text-purple-400">{pelicula.duracion} min</span>
            </p>
            {pelicula.fechaEstreno && (
              <p className="text-gray-300 text-center text-sm">
                Año: <span className="font-semibold text-purple-400">
                  {new Date(pelicula.fechaEstreno).getFullYear()}
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="mb-8 text-sm text-gray-300 text-center px-6">
          Esta acción no se puede deshacer. La película será eliminada permanentemente.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
          <Button
            color
            className="w-full sm:w-auto text-white bg-slate-700 hover:bg-white/10"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto text-white text-sm bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            onClick={onSuccess}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              'Sí, eliminar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeletePeliculas;