import { Button } from "flowbite-react";

function ModalDeleteFuncion({ funcion, onConfirm, onCancel, isDeleting = false }) {
  if (funcion.estado !== "Privada") {
    return (
      <div className="bg-slate-800 border-slate-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-bold mb-4">Eliminar Función</h2>
        <p className="text-gray-300 text-center">Solo puedes eliminar funciones en estado <span className="font-bold text-red-500">Privada</span>.</p>
        <div className="flex justify-center mt-6">
          <Button color className="text-white bg-slate-700 hover:bg-white/10" onClick={onCancel}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-slate-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Eliminar Función</h2>
      <h3 className="mb-3 text-lg font-normal text-white text-center">
        ¿Estás seguro de que quieres eliminar esta función?
      </h3>
      <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
        <p className="text-white font-medium text-center">
          "{funcion.pelicula?.nombrePelicula || 'Sin película'}"
        </p>
        <p className="text-gray-300 text-center text-sm">
          Sala: <span className="font-semibold text-purple-400">{funcion.sala?.ubicacion || 'Sin ubicación'}</span>
        </p>
        <p className="text-gray-300 text-center text-sm">
          Fecha: <span className="font-semibold text-purple-400">{new Date(funcion.fechaHoraFuncion).toLocaleString('es-ES')}</span>
        </p>
      </div>
      <p className="mb-5 text-sm text-gray-300 text-center">
        Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          color
          className="text-white bg-slate-700 hover:bg-white/10"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
}

export default ModalDeleteFuncion;
