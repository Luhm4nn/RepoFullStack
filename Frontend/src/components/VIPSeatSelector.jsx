import { useState, useEffect } from 'react';

const VIPSeatSelector = ({ 
  filas = 10, 
  asientosPorFila = 12, 
  initialVipSeats = [], 
  onVIPSeatsChange 
}) => {
  const [vipSeats, setVipSeats] = useState(new Set());
  
  const rows = Array.from({ length: parseInt(filas) || 10 }, (_, i) => 
    String.fromCharCode(65 + i) // A, B, C, D...
  );

  useEffect(() => {
    if (initialVipSeats && initialVipSeats.length > 0) {
      setVipSeats(new Set(initialVipSeats));
    }
  }, [initialVipSeats]);

  const getSeatId = (row, seatNum) => `${row}${seatNum}`;

  const toggleVIPSeat = (seatId) => {
    setVipSeats(prev => {
      const newVipSeats = new Set(prev);
      if (newVipSeats.has(seatId)) {
        newVipSeats.delete(seatId);
      } else {
        newVipSeats.add(seatId);
      }
      
      if (onVIPSeatsChange) {
        onVIPSeatsChange(Array.from(newVipSeats));
      }
      
      return newVipSeats;
    });
  };

  const toggleRowVIP = (row) => {
    setVipSeats(prev => {
      const newVipSeats = new Set(prev);
      const seatsPerRow = parseInt(asientosPorFila) || 12;
      
      const rowSeats = Array.from({ length: seatsPerRow }, (_, i) => getSeatId(row, i + 1));
      
      const allRowVIP = rowSeats.every(seatId => newVipSeats.has(seatId));
      
      if (allRowVIP) {
        rowSeats.forEach(seatId => newVipSeats.delete(seatId));
      } else {
        rowSeats.forEach(seatId => newVipSeats.add(seatId));
      }
      
      if (onVIPSeatsChange) {
        onVIPSeatsChange(Array.from(newVipSeats));
      }
      
      return newVipSeats;
    });
  };

  const clearAllVIP = () => {
    setVipSeats(new Set());
    if (onVIPSeatsChange) {
      onVIPSeatsChange([]);
    }
  };

  const resetToInitial = () => {
    setVipSeats(new Set(initialVipSeats));
    if (onVIPSeatsChange) {
      onVIPSeatsChange([...initialVipSeats]);
    }
  };

  const getVIPCount = () => vipSeats.size;
  const getTotalSeats = () => (parseInt(filas) || 10) * (parseInt(asientosPorFila) || 12);
  const hasChanges = () => {
    const current = [...vipSeats].sort();
    const initial = [...initialVipSeats].sort();
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  return (
    <div className="bg-slate-700/40 border border-slate-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-lg font-semibold">Configurar Asientos VIP</h3>
        <div className="flex justify-center">
          <div className="w-48 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg opacity-60"></div>
        </div>
        <p className="text-center text-gray-400 text-sm">PANTALLA</p>
      </div>

      {/* Seat Map */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
        {rows.map((row) => {
          const seatsPerRow = parseInt(asientosPorFila);
          const rowSeats = Array.from({ length: seatsPerRow }, (_, i) => getSeatId(row, i + 1));
          const allRowVIP = rowSeats.every(seatId => vipSeats.has(seatId));
          const someRowVIP = rowSeats.some(seatId => vipSeats.has(seatId));
          
          return (
            <div key={row} className="flex items-center w-fit mx-auto gap-1">
              {/* Botón para seleccionar toda la fila */}
              <button
                type="button"
                onClick={() => toggleRowVIP(row)}
                className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all duration-200 mr-1 ${
                  allRowVIP
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/30"
                    : someRowVIP
                    ? "bg-yellow-400/50 text-yellow-200 border border-yellow-400/50"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {row}
              </button>
              
              <div className="flex gap-0.5">
                {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                  const seatId = getSeatId(row, seatNum);
                  const isVIP = vipSeats.has(seatId);
                  const wasInitiallyVIP = initialVipSeats.includes(seatId);

                  return (
                    <button
                      type="button"
                      key={seatNum}
                      onClick={() => toggleVIPSeat(seatId)}
                      className={`w-7 h-7 rounded-t-lg text-xs font-mono transition-all duration-200 relative ${
                        isVIP
                          ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 font-bold"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      {seatNum}
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
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">  
            <div className="w-4 h-4 bg-yellow-400 rounded-t-lg"></div>
            <span className="text-gray-400">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400/50 border border-yellow-400/50 rounded"></div>
            <span className="text-gray-400">Fila Parcial</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex flex-col gap-1">
            <span>Asientos VIP: {getVIPCount()}/{getTotalSeats()}</span>
            {initialVipSeats.length > 0 && (
              <span className="text-xs">
                Iniciales: {initialVipSeats.length} 
                {hasChanges() && (
                  <span className="text-blue-400 ml-1">(modificado)</span>
                )}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {initialVipSeats.length > 0 && hasChanges() && (
              <button
                onClick={resetToInitial}
                type="button"
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors"
              >
                Restaurar
              </button>
            )}
            <button
              onClick={clearAllVIP}
              type="button"
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700 text-white rounded text-xs transition-colors"
            >
              Limpiar VIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPSeatSelector;