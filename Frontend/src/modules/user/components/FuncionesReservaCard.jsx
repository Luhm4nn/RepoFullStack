import { formatDateTime } from "../../shared/utils/dateFormater";

function FuncionesReservaCard({ funcion, onReservar }) {
  // Determinar el campo de fecha/hora correcto
  const fechaHora = funcion.fechaHoraFuncion || funcion.hora || funcion.horario;
  const { fecha, hora } = formatDateTime(fechaHora);
  return (
    <div className="mb-4 p-4 bg-slate-900 rounded-xl border border-gray-700 shadow flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="text-lg font-semibold text-white mb-1">
          Sala: <span className="text-purple-400">{funcion.sala?.nombreSala || funcion.idSala}</span>
        </div>
        <div className="text-gray-300 text-base">
          <span className="font-medium">{fecha}</span> &nbsp;|&nbsp; <span className="font-medium">{hora}</span>
        </div>
      </div>
      <button
        onClick={() => onReservar?.(funcion)} // Pass the entire function object
        className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
      >
        Reservar
      </button>
    </div>
  );
}

export default FuncionesReservaCard;