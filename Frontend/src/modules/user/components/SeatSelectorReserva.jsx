import { useEffect, useState, useMemo } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { getAsientosReservadosPorFuncion } from '../../../api/AsientoReservas.api';
import { getAsientosBySala } from '../../../api/Salas.api';
import { CenteredSpinner } from '../../shared/components/Spinner';

function SeatSelectorReserva({ idSala, fechaHoraFuncion, onSeatsChange }) {
  const [seats, setSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

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
        console.error('Error cargando mapa de asientos:', error);
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
        return prev.filter(
          (s) => !(s.filaAsiento === seat.filaAsiento && s.nroAsiento === seat.nroAsiento)
        );
      } else {
        if (prev.length >= 10) {
          notify.warning('Solo puedes seleccionar hasta 10 asientos.', {
            id: 'seat-limit-warning',
          });
          return prev;
        }
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
    const isReserved = reservedSeats.some((rs) => rs.filaAsiento === fila && rs.nroAsiento === nro);
    if (isReserved) return 'reserved';

    const isSelected = selectedSeats.some((s) => s.filaAsiento === fila && s.nroAsiento === nro);
    if (isSelected) return 'selected';

    return 'available';
  };

  if (loading) return <CenteredSpinner message="Preparando sala..." />;

  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="bg-slate-700/40 border border-slate-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-lg font-semibold">Seleccionar Asientos</h3>
        <div className="flex justify-center">
          <div className="w-48 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg opacity-60"></div>
        </div>
        <p className="text-center text-gray-400 text-sm">PANTALLA</p>
      </div>

      {/* Seat Map */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {sortedRows.map((row) => {
          const rowSeats = seatsByRow[row] || [];

          return (
            <div key={row} className="flex items-center w-fit mx-auto gap-1">
              {/* Letra de fila */}
              <button
                type="button"
                disabled
                className="w-6 h-6 rounded text-xs font-mono font-bold bg-slate-700 text-gray-300 mr-1"
              >
                {row}
              </button>

              <div className="flex gap-0.5">
                {rowSeats
                  .sort((a, b) => a.nroAsiento - b.nroAsiento)
                  .map((seat) => {
                    const status = getSeatStatus(seat.filaAsiento, seat.nroAsiento);
                    const isVIP = seat.tipo === 'VIP';

                    return (
                      <button
                        type="button"
                        key={`${seat.filaAsiento}${seat.nroAsiento}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={status === 'reserved'}
                        className={`w-7 h-7 rounded-t-lg text-xs font-mono transition-all duration-200 relative ${
                          status === 'selected'
                            ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 font-bold'
                            : status === 'reserved'
                              ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 font-bold cursor-not-allowed'
                              : isVIP
                                ? 'bg-yellow-400/50 text-yellow-200 hover:bg-yellow-400/70'
                                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                        }`}
                      >
                        {seat.nroAsiento}
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda y controles */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-600 rounded-t-lg"></div>
            <span className="text-gray-400">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-t-lg"></div>
            <span className="text-gray-400">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/30 rounded"></div>
            <span className="text-gray-400">Ocupado</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 border-t border-slate-600 pt-3">
          <div className="flex flex-col gap-1">
            <span>Asientos seleccionados: {selectedSeats.length} / 10</span>
          </div>

          {selectedSeats.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedSeats([])}
              className="px-3 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeatSelectorReserva;
