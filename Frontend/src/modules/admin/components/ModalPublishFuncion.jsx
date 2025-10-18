import { Button } from "flowbite-react";

function ModalPublishFuncion({ funcion, onConfirm, onCancel, isPublishing = false }) {
  const isPrivada = funcion.estado === "Privada";
  const accion = isPrivada ? "publicar" : "hacer privada";
  const estadoDestino = isPrivada ? "Publica" : "Privada";

  return (
      <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
          {isPrivada ? "Publicar Función" : "Hacer Función Privada"}
        </h2>
        <h3 className="mb-6 text-base sm:text-lg font-normal text-white text-center px-4">
          ¿Estás seguro de que quieres {accion} esta función?
        </h3>
        <div className="mb-6 p-5 bg-slate-700/50 rounded-lg mx-auto">
          <p className="text-white font-medium text-center mb-3">
            "{funcion.pelicula?.nombrePelicula || 'Sin película'}"
          </p>
          <div className="space-y-3">
            <p className="text-gray-300 text-center text-sm">
              Sala: <span className="font-semibold text-purple-400">{funcion.sala?.nombreSala || 'Sin ubicación'}</span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Fecha: <span className="font-semibold text-purple-400">{new Date(funcion.fechaHoraFuncion).toLocaleString('es-ES')}</span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Estado actual: <span className={`font-semibold ${isPrivada ? 'text-red-500' : 'text-green-500'}`}>{funcion.estado}</span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Nuevo estado: <span className={`font-semibold ${isPrivada ? 'text-green-500' : 'text-red-500'}`}>{estadoDestino}</span>
            </p>
          </div>
        </div>
        <p className="mb-8 text-sm text-gray-300 text-center px-6">
          {isPrivada 
            ? "Al publicar, la función no podrá ser editada ni eliminada."
            : "Al hacer privada, la función podrá ser editada y eliminada nuevamente."
          }
        </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
        <Button
          color
          className="w-full sm:w-auto text-white bg-slate-700 hover:bg-white/10"
          onClick={onCancel}
          disabled={isPublishing}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={`w-full sm:w-auto text-white text-sm ${
            isPrivada 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
          }`}
          onClick={onConfirm}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isPrivada ? "Publicando..." : "Haciendo privada..."}
            </>
          ) : (
            `Sí, ${accion}`
          )}
        </Button>
      </div>
    </div>
  );
}

export default ModalPublishFuncion;