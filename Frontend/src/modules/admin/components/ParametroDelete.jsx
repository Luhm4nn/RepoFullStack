import { Button } from "flowbite-react";
import { ButtonSpinner } from "../../shared/components/Spinner";

function ParametroDelete({
  parametro,
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50">
      <div className="fixed inset-0 backdrop-blur-sm !bg-black/30"></div>

      <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full mx-4 relative">
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
          Eliminar Parámetro
        </h2>
        <h3 className="mb-6 text-base sm:text-lg font-normal text-white text-center px-4">
          ¿Estás seguro de que quieres eliminar este parámetro?
        </h3>

        <div className="mb-6 p-5 bg-slate-700/50 rounded-lg mx-auto">
          <p className="text-white font-medium text-center mb-3">
            "{parametro.descripcionParametro}"
          </p>
          <div className="space-y-3">
            <p className="text-gray-300 text-center text-sm">
              Valor actual:{" "}
              <span className="font-semibold text-purple-400">
                {parametro.valor}
              </span>
            </p>
          </div>
        </div>

        <p className="mb-8 text-sm text-gray-300 text-center px-6">
          Esta acción no se puede deshacer. El parámetro será eliminado
          permanentemente.
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
                <ButtonSpinner size="sm" />
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

export default ParametroDelete;
