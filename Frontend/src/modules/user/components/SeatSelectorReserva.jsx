import { useEffect, useState, useMemo } from "react";
import { getAsientosReservadosPorFuncion } from "../../../api/AsientoReservas.api";
import { getAsientosBySala } from "../../../api/Salas.api";
import { CenteredSpinner } from "../../shared/components/Spinner";

function SeatSelectorReserva({ idSala, fechaHoraFuncion, onSeatsChange }) {
  const [seats, setSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [seatsData, reservations] = await Promise.all([
          getAsientosBySala(idSala),
          getAsientosReservadosPorFuncion(idSala, fechaHoraFuncion),
        ]);
        setSeats(Array.isArray(seatsData) ? seatsData : []);
        setReservedSeats(Array.isArray(reservations) ? reservations : []);
      } catch (error) {
        console.error("Error cargando mapa de asientos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idSala, fechaHoraFuncion]);

  const seatsByRow = useMemo(() => {
    return seats.reduce((acc, seat) => {
      const row = seat.filaAsiento;
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});
  }, [seats]);

  const toggleSeat = (seat) => {
    const isReserved = reservedSeats.some(
      (rs) => rs.filaAsiento === seat.filaAsiento && rs.nroAsiento === seat.nroAsiento
    );
    if (isReserved) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some(
        (s) => s.filaAsiento === seat.filaAsiento && s.nroAsiento === seat.nroAsiento
      );
      if (isSelected) {
        return prev.filter((s) => !(s.filaAsiento === seat.filaAsiento && s.nroAsiento === seat.nroAsiento));
      } else {
        return [...prev, seat];
      }
    });
  };

  useEffect(() => {
    const total = selectedSeats.reduce((sum, s) => sum + (Number(s.tarifa?.precio) || 0), 0);
    if (onSeatsChange) {
      onSeatsChange({
        seats: selectedSeats,
        total,
        count: selectedSeats.length,
      });
    }
  }, [selectedSeats, onSeatsChange]);

  const getSeatStatus = (fila, nro) => {
    const isReserved = reservedSeats.some(
      (rs) => rs.filaAsiento === fila && rs.nroAsiento === nro
    );
    if (isReserved) return "reserved";

    const isSelected = selectedSeats.some(
      (s) => s.filaAsiento === fila && s.nroAsiento === nro
    );
    if (isSelected) return "selected";

    return "available";
  };

  if (loading) return <CenteredSpinner message="Preparando sala..." />;

  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="flex flex-col items-center bg-slate-900/40 p-4 sm:p-10 rounded-3xl border border-white/5 shadow-2xl w-full overflow-hidden">
      {/* Pantalla / Escenario */}
      <div className="w-full max-w-xl mb-12 relative px-4">
        <div className="h-1 sm:h-2 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[1px]" />
        <div className="h-8 sm:h-12 w-full bg-gradient-to-b from-purple-500/10 to-transparent rounded-t-full mt-1" />
        <p className="text-purple-300/40 text-[8px] sm:text-[10px] tracking-[0.4em] text-center font-bold uppercase -mt-4">
          PANTALLA
        </p>
      </div>

      {/* Grid de Asientos con Scroll Horizontal para Mobile */}
      <div className="w-full overflow-x-auto pb-6 px-2 scrollbar-thin scrollbar-thumb-purple-500/20">
        <div className="inline-grid gap-2 sm:gap-4 min-w-full justify-center">
          {sortedRows.map((row) => (
            <div key={row} className="flex items-center gap-3 sm:gap-6">
              <span className="w-4 sm:w-6 text-gray-600 font-bold text-xs sm:text-sm text-center">{row}</span>
              <div className="flex gap-1.5 sm:gap-2.5">
                {seatsByRow[row]
                  .sort((a, b) => a.nroAsiento - b.nroAsiento)
                  .map((seat) => {
                    const status = getSeatStatus(seat.filaAsiento, seat.nroAsiento);
                    const isVIP = seat.tipo === "VIP";
                    
                    return (
                      <button
                        key={`${seat.filaAsiento}${seat.nroAsiento}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={status === "reserved"}
                        className={`
                          relative w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200
                          ${status === "selected" 
                            ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] z-10" 
                            : ""}
                          ${status === "reserved" 
                            ? "bg-red-600/20 border border-red-600/30 text-red-600/40 cursor-not-allowed" 
                            : ""}
                          ${status === "available" 
                            ? (isVIP 
                                ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20" 
                                : "bg-slate-800 border border-white/5 text-gray-500 hover:border-purple-500/40") 
                            : ""}
                        `}
                      >
                        <span className="text-[9px] sm:text-[10px] font-bold">{seat.nroAsiento}</span>
                        {isVIP && status === "available" && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full border border-slate-900" />
                        )}
                      </button>
                    );
                  })}
              </div>
              <span className="w-4 sm:w-6 text-gray-600 font-bold text-xs sm:text-sm text-center">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-white/5 w-full">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-800 border border-white/5 rounded" />
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Libre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500/20 border border-amber-500/50 rounded" />
          <span className="text-[10px] sm:text-xs text-amber-500/80 font-medium">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-600 rounded shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
          <span className="text-[10px] sm:text-xs text-purple-300 font-medium">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600/20 border border-red-600/30 rounded" />
          <span className="text-[10px] sm:text-xs text-red-600/60 font-medium">Ocupado</span>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectorReserva;
