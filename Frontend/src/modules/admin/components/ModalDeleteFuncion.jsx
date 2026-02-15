import { Button } from "flowbite-react";
import { ButtonSpinner } from "../../shared/components/Spinner";
import { ESTADOS_FUNCION } from "../../../constants";

function ModalDeleteFuncion({
  funcion,
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  if (funcion.estado !== ESTADOS_FUNCION.PRIVADA && funcion.estado !== ESTADOS_FUNCION.INACTIVA) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50">
        <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
            Eliminar Función
          </h2>
          <p className="text-gray-300 text-center px-4 mb-8">
            Solo puedes eliminar funciones en estado{" "}
            <span className="font-bold text-red-500">Privada</span> o{" "}
            <span className="font-bold text-orange-500">Inactiva</span>.
          </p>
          <div className="flex justify-center px-6">
            <Button
              color
              className="w-full sm:w-auto text-white bg-slate-700 hover:bg-white/10"
              onClick={onCancel}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
          Eliminar Función
        </h2>
        <h3 className="mb-6 text-base sm:text-lg font-normal text-white text-center px-4">
          ¿Estás seguro de que quieres eliminar esta función?
        </h3>
        <div className="mb-6 p-5 bg-slate-700/50 rounded-lg mx-auto">
          <p className="text-white font-medium text-center mb-3">
            "{funcion.pelicula?.nombrePelicula || "Sin película"}"
          </p>
          <div className="space-y-3">
            <p className="text-gray-300 text-center text-sm">
              Sala:{" "}
              <span className="font-semibold text-purple-400">
                {funcion.sala?.ubicacion || "Sin ubicación"}
              </span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Fecha:{" "}
              <span className="font-semibold text-purple-400">
                {new Date(funcion.fechaHoraFuncion).toLocaleString("es-ES")}
              </span>
            </p>
          </div>
        </div>
        <p className="mb-8 text-sm text-gray-300 text-center px-6">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
          <Button
            color
            className="w-full sm:w-auto text-white bg-slate-700 hover:bg-white/10"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto text-white text-sm bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <ButtonSpinner className="mr-2" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeleteFuncion;
