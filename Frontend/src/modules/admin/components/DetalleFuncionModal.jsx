import { useState, useEffect } from "react";
import { getAsientosReservadosPorFuncion } from "../../../api/AsientoReservas.api";
import { formatDateTime } from "../../shared/utils/dateFormater";

function DetalleFuncionModal({ funcion, onClose, detalles }) {
    const [asientos, setAsientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);
    const pelicula = detalles?.pelicula || funcion.pelicula;
    const sala = detalles?.sala || funcion.sala;

    useEffect(() => {
        const cargarAsientos = async () => {
            setLoading(true);
            setError(null);
            try {
                const todosAsientos = await getAsientosReservadosPorFuncion(
                    funcion.idSala,
                    funcion.fechaHoraFuncion
                );
                setAsientos(todosAsientos);
            } catch (err) {
                console.error("Error cargando asientos:", err);
                setError("No se pudieron cargar los asientos");
            } finally {
                setLoading(false);
            }
        };

        cargarAsientos();
    }, [funcion]);

    // Crear mapa de asientos
    const crearMapaAsientos = () => {
        if (!sala || !asientos) return null;

        const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const asientosPorFila = Math.ceil(sala.cantidadAsientos / filas.length);

        const asientosReservadosSet = new Set(
            asientos.map(a => `${a.filaAsiento}${a.nroAsiento}`)
        );

        return filas.map((fila, filaIdx) => {
            const asientosFila = [];
            for (let i = 1; i <= asientosPorFila; i++) {
                const asientoId = `${fila}${i}`;
                const estaReservado = asientosReservadosSet.has(asientoId);
                asientosFila.push({ id: asientoId, reservado: estaReservado });
            }
            return { fila, asientos: asientosFila };
        });
    };

    const mapaAsientos = crearMapaAsientos();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="border-b border-slate-700 p-4 sm:p-6 flex justify-between items-start flex-shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Detalles de Función</h2>
                        <p className="text-gray-400 text-sm sm:text-base">Estadísticas y ocupación</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
                    {/* Película */}
                    <div className="flex gap-6 mb-6">
                        <img
                            src={pelicula?.portada || "/placeholder.svg"}
                            alt={pelicula?.nombrePelicula}
                            className="w-32 h-48 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {pelicula?.nombrePelicula || "Película"}
                            </h3>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                    {pelicula?.MPAA}
                                </span>
                                <span className="text-gray-400 text-sm">{pelicula?.generoPelicula}</span>
                                <span className="text-gray-400 text-sm">• {pelicula?.duracion} min</span>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-3">{pelicula?.sinopsis}</p>
                        </div>
                    </div>

                    {/* Información de la función */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Información de la Función
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">Fecha</p>
                                <p className="text-white font-semibold">{fecha}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Hora</p>
                                <p className="text-white font-semibold">{hora}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Sala</p>
                                <p className="text-white font-semibold">{sala?.nombreSala || `Sala ${funcion.idSala}`}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Estado</p>
                                <p className={`font-semibold ${funcion.estado === 'Privada' ? 'text-red-500' :
                                        funcion.estado === 'Publica' ? 'text-green-500' :
                                            'text-gray-500'
                                    }`}>
                                    {funcion.estado}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* Ocupación */}
                        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Ocupación
                                </h4>
                                <span className="text-2xl font-bold text-blue-400">
                                    {detalles?.porcentajeOcupacion?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${detalles?.porcentajeOcupacion || 0}%` }}
                                />
                            </div>
                            <p className="text-gray-300 text-sm">
                                {detalles?.asientosReservados || 0} / {detalles?.totalAsientosSala || sala?.cantidadAsientos || 0} asientos
                            </p>
                        </div>

                        {/* Ganancia */}
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Ganancia Total
                                </h4>
                            </div>
                            <p className="text-3xl font-bold text-green-400 mb-1">
                                ${detalles?.gananciaTotal?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-gray-300 text-sm">
                                Recaudado hasta el momento
                            </p>
                        </div>
                    </div>

                    {/* Mapa de Asientos */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Mapa de Asientos
                        </h4>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-400 text-center py-4">{error}</div>
                        ) : (
                            <div className="space-y-2">
                                {/* Pantalla */}
                                <div className="mb-6">
                                    <div className="h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded mb-1"></div>
                                    <p className="text-center text-gray-400 text-xs">PANTALLA</p>
                                </div>

                                {/* Asientos */}
                                {mapaAsientos?.map((filaData) => (
                                    <div key={filaData.fila} className="flex items-center gap-2">
                                        <span className="text-gray-400 font-semibold w-6 text-center">{filaData.fila}</span>
                                        <div className="flex gap-1 flex-1 justify-center">
                                            {filaData.asientos.map((asiento) => (
                                                <div
                                                    key={asiento.id}
                                                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-t-lg flex items-center justify-center text-xs font-semibold transition-all ${asiento.reservado
                                                            ? 'bg-purple-600 text-white border border-purple-400'
                                                            : 'bg-slate-700 text-gray-400 border border-slate-600'
                                                        }`}
                                                    title={asiento.id}
                                                >
                                                    {asiento.reservado ? '✓' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Leyenda */}
                                <div className="flex justify-center gap-6 pt-4 mt-4 border-t border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-purple-600 border border-purple-400 rounded-t-lg"></div>
                                        <span className="text-gray-300 text-sm">Reservado</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-700 border border-slate-600 rounded-t-lg"></div>
                                        <span className="text-gray-300 text-sm">Disponible</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleFuncionModal;
