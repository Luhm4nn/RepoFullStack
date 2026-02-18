import { Button } from 'flowbite-react';
import { ButtonSpinner } from '../../shared/components/Spinner';

function ModalCancelarReserva({ reserva, onConfirm, onCancel, isCancelling = false }) {
  if (!reserva) return null;

  const nombrePelicula = reserva.funcion?.pelicula?.nombrePelicula || 'esta película';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative bg-slate-800 border border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg z-10 w-full max-w-lg mx-4">
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-6 text-center">
          Cancelar Reserva
        </h2>
        <h3 className="mb-6 text-base sm:text-lg font-normal text-white text-center px-4">
          ¿Estás seguro que deseas cancelar esta reserva?
        </h3>

        <div className="mb-6 p-5 bg-slate-700/50 rounded-lg mx-auto">
          <p className="text-white font-medium text-center mb-3">"{nombrePelicula}"</p>
          <div className="space-y-2">
            <p className="text-gray-300 text-center text-sm">
              Sala:{' '}
              <span className="font-semibold text-purple-400">
                {reserva.funcion?.sala?.nombreSala || `Sala ${reserva.idSala}`}
              </span>
            </p>
            <p className="text-gray-300 text-center text-sm">
              Total abonado: <span className="font-semibold text-green-400">${reserva.total}</span>
            </p>
          </div>
        </div>

        <p className="mb-8 text-sm text-gray-300 text-center px-6">
          Esta acción no se puede deshacer. Los asientos quedarán liberados.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
          <Button
            color
            className="w-full sm:w-auto text-white bg-slate-700 hover:bg-white/10 rounded-lg"
            onClick={onCancel}
            disabled={isCancelling}
          >
            Volver
          </Button>
          <Button
            className="w-full sm:w-auto text-white text-sm bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <ButtonSpinner className="mr-2" />
                Cancelando...
              </>
            ) : (
              'Sí, cancelar reserva'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalCancelarReserva;
