import { useState, useEffect, useRef } from "react";
import { getAsientosBySala } from "../../../api/Salas.api";
import { getAsientosReservadosPorFuncion } from "../../../api/AsientoReservas.api";
import { useNotification } from "../../../context/NotificationContext";
import { CenteredSpinner } from "../../shared/components/Spinner";

const SeatSelectorReserva = ({
  idSala,
  fechaHoraFuncion,
  onSeatsChange,
  maxSeats = 10,
}) => {
  const [asientos, setAsientos] = useState([]);
  const [asientosReservados, setAsientosReservados] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [filas, setFilas] = useState([]);
  const [asientosPorFila, setAsientosPorFila] = useState(0);
  const notify = useNotification();
  
  // Usar ref para mantener referencia estable a onSeatsChange
  const onSeatsChangeRef = useRef(onSeatsChange);
  useEffect(() => {
    onSeatsChangeRef.current = onSeatsChange;
  });

  // Efecto para resetear selección cuando cambia la función
  useEffect(() => {
    setSelectedSeats(new Set());
    setTotalPrice(0);
    if (onSeatsChangeRef.current) {
      onSeatsChangeRef.current({ seats: [], total: 0, count: 0 });
    }
  }, [idSala, fechaHoraFuncion]);

  // Efecto para cargar asientos de la sala y reservados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const asientosData = await getAsientosBySala(idSala);
        setAsientos(asientosData);

        // Organizar asientos por filas
        const filasMap = {};
        let maxAsientosPorFila = 0;

        asientosData.forEach((asiento) => {
          if (!filasMap[asiento.filaAsiento]) {
            filasMap[asiento.filaAsiento] = [];
          }
          filasMap[asiento.filaAsiento].push(asiento);
          maxAsientosPorFila = Math.max(maxAsientosPorFila, asiento.nroAsiento);
        });

        const filasOrdenadas = Object.keys(filasMap).sort();
        setFilas(filasOrdenadas);
        setAsientosPorFila(maxAsientosPorFila);

        // Obtener asientos ya reservados para esta función
        const reservadosData = await getAsientosReservadosPorFuncion(
          idSala,
          fechaHoraFuncion
        );

        const reservadosSet = new Set(
          reservadosData.map((ar) => `${ar.filaAsiento}${ar.nroAsiento}`)
        );
        setAsientosReservados(reservadosSet);
      } catch (err) {
        setError("Error al cargar los asientos");
      } finally {
        setLoading(false);
      }
    };

    if (idSala && fechaHoraFuncion) {
      fetchData();
    }
  }, [idSala, fechaHoraFuncion]);

  // Efecto para notificar cambios al padre cuando cambian los asientos seleccionados
  useEffect(() => {
    const selectedAsientos = [];
    selectedSeats.forEach((id) => {
      const f = id.charAt(0);
      const n = id.slice(1);
      const asiento = asientos.find(
        (a) => a.filaAsiento === f && a.nroAsiento === parseInt(n)
      );
      if (asiento) {
        selectedAsientos.push(asiento);
      }
    });

    if (onSeatsChangeRef.current) {
      onSeatsChangeRef.current({
        seats: selectedAsientos,
        total: totalPrice,
        count: selectedSeats.size,
      });
    }
  }, [selectedSeats, totalPrice, asientos]);

  const getSeatId = (fila, numero) => `${fila}${numero}`;

  const getAsientoInfo = (fila, numero) => {
    return asientos.find(
      (a) => a.filaAsiento === fila && a.nroAsiento === numero
    );
  };

  const toggleSeat = (fila, numero) => {
    const seatId = getSeatId(fila, numero);

    // No permitir seleccionar asientos ya reservados
    if (asientosReservados.has(seatId)) {
      return;
    }

    const asientoInfo = getAsientoInfo(fila, numero);
    if (!asientoInfo) return;

    const precio = parseFloat(asientoInfo.tarifa?.precio) || 0;
    const isCurrentlySelected = selectedSeats.has(seatId);

    // Si está intentando agregar pero ya alcanzó el límite
    if (!isCurrentlySelected && selectedSeats.size >= maxSeats) {
      notify.warning(`Máximo ${maxSeats} asientos por reserva`);
      return;
    }

    // Actualizar asientos seleccionados
    setSelectedSeats((prev) => {
      const newSelected = new Set(prev);
      if (isCurrentlySelected) {
        newSelected.delete(seatId);
      } else {
        newSelected.add(seatId);
      }
      return newSelected;
    });

    // Actualizar precio de forma separada
    setTotalPrice((prevPrice) => 
      isCurrentlySelected ? prevPrice - precio : prevPrice + precio
    );
  };

  const clearSelection = () => {
    setSelectedSeats(new Set());
    setTotalPrice(0);
    // El useEffect se encargará de notificar al padre
  };

  const getSeatStatus = (fila, numero) => {
    const seatId = getSeatId(fila, numero);
    if (asientosReservados.has(seatId)) return "reserved";
    if (selectedSeats.has(seatId)) return "selected";

    const asiento = getAsientoInfo(fila, numero);
    if (!asiento) return "unavailable";

    return asiento.tipo === "VIP" ? "vip" : "available";
  };

  const getSeatStyle = (status) => {
    switch (status) {
      case "reserved":
        return "bg-red-600 cursor-not-allowed";
      case "selected":
        return "bg-green-500 shadow-lg shadow-green-500/30";
      case "vip":
        return "bg-yellow-400 text-black hover:bg-yellow-500";
      case "available":
        return "bg-slate-600 hover:bg-slate-500";
      case "unavailable":
        return "bg-gray-800 cursor-not-allowed opacity-50";
      default:
        return "bg-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CenteredSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
      {/* Pantalla */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-64 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg opacity-60"></div>
        </div>
        <p className="text-gray-400 text-sm">PANTALLA</p>
      </div>

      {/* Mapa de asientos */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {filas.map((fila) => (
          <div key={fila} className="flex items-center justify-center gap-1">
            <span className="w-6 text-gray-400 text-sm font-mono text-center">
              {fila}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: asientosPorFila }, (_, i) => i + 1).map(
                (numero) => {
                  const status = getSeatStatus(fila, numero);
                  const asientoInfo = getAsientoInfo(fila, numero);
                  const isClickable =
                    status !== "reserved" && status !== "unavailable";

                  if (!asientoInfo) {
                    return <div key={numero} className="w-8 h-8" />;
                  }

                  return (
                    <button
                      key={numero}
                      type="button"
                      onClick={() => isClickable && toggleSeat(fila, numero)}
                      disabled={!isClickable}
                      className={`
                      w-8 h-8 rounded-t-lg text-xs font-mono transition-all duration-200
                      ${getSeatStyle(status)}
                      ${isClickable ? "cursor-pointer" : ""}
                    `}
                      title={`Fila ${fila}, Asiento ${numero}${asientoInfo.tarifa ? ` - $${asientoInfo.tarifa.precio}` : ""}`}
                    >
                      {numero}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-4 text-sm flex-wrap pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-600 rounded-t-lg"></div>
          <span className="text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-t-lg"></div>
          <span className="text-gray-400">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-t-lg"></div>
          <span className="text-gray-400">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-t-lg"></div>
          <span className="text-gray-400">Ocupado</span>
        </div>
      </div>

      {/* Resumen de selección */}
      {selectedSeats.size > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">
                Asientos seleccionados: {selectedSeats.size}
              </p>
              <p className="text-gray-400 text-sm">
                {Array.from(selectedSeats).join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${totalPrice}</p>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectorReserva;
