import { Button } from "flowbite-react";


function SalaDelete({ sala, onConfirm, onCancel }) {
  return (
    <div className="bg-slate-800 border-slate-700 p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Eliminar Sala</h2>
      
      <h3 className="mb-5 text-lg font-normal text-white text-center">
        ¿Estás seguro de que quieres eliminar la Sala {sala.nombreSala}?
      </h3>
      <p className="mb-5 text-sm text-gray-300 text-center">
        Esta acción no se puede deshacer.
      </p>

    {/*Botones*/}
      <div className="flex justify-center gap-4">
        <Button
        color
        className = "text-white bg-slate-700 hover:bg-white/10"
        onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
        type = "submit"
        className="w-full sm:w-auto text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
        onClick={onConfirm}
        >
          Sí, eliminar
        </Button>

      </div>
    </div>
  );
}

export default SalaDelete;