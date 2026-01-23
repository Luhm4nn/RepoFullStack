import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import { getVentasMensuales, getAsistenciaReservas, getOcupacionSalas } from '../../../api/Reportes.api.js';

const ReportsPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ventasData, setVentasData] = useState(null);
    const [asistenciaData, setAsistenciaData] = useState(null);
    const [ocupacionData, setOcupacionData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const [ventas, asistencia, ocupacion] = await Promise.all([
                    getVentasMensuales(),
                    getAsistenciaReservas(),
                    getOcupacionSalas()
                ]);
                
                console.log('Ventas:', ventas);
                console.log('Asistencia:', asistencia);
                console.log('Ocupación:', ocupacion);
                
                setVentasData(ventas);
                setAsistenciaData(asistencia);
                setOcupacionData(ocupacion);
            } catch (error) {
                console.error("Error loading reports:", error);
                setError(error.message || "Error al cargar los reportes");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
    };

    if (loading) {
        return (
            <div className="p-8 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Cargando reportes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 min-h-screen flex items-center justify-center">
                <div className="text-center bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Error al cargar reportes</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Calculate stats safely
    const totalVentas = ventasData?.series?.[0]?.data?.reduce((a, b) => a + b, 0) || 0;
    const totalAsistidas = asistenciaData?.series?.[0]?.data?.reduce((a, b) => a + b, 0) || 0;
    const totalNoAsistidas = asistenciaData?.series?.[1]?.data?.reduce((a, b) => a + b, 0) || 0;
    const totalReservasAsistencia = totalAsistidas + totalNoAsistidas;
    const porcentajeAsistencia = totalReservasAsistencia > 0 
        ? ((totalAsistidas / totalReservasAsistencia) * 100).toFixed(1)
        : 0;
    const avgOcupacion = ocupacionData?.series?.length > 0 
        ? (ocupacionData.series.reduce((a, b) => a + b, 0) / ocupacionData.series.length).toFixed(1)
        : 0;

    const reportCards = [
        {
            title: "Tickets Vendidos Últimos 12 Meses",
            stat: totalVentas.toString(),
            percentage: 12.5,
            period: "Mes actual y 11 meses anteriores",
            chartType: "area",
            series: ventasData?.series || [],
            viewModes: [
                { label: "Reservas", seriesIndex: 0 },
                { label: "Ingresos ($)", seriesIndex: 1 }
            ],
            defaultViewMode: 0,
            options: {
                colors: ["#3b82f6", "#06b6d4"],
                chart: {
                    type: 'area',
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.2,
                        stops: [0, 90, 100]
                    },
                },
                stroke: { 
                    curve: 'smooth',
                    width: 2
                },
                xaxis: { 
                    categories: ventasData?.categories || [],
                },
                legend: {
                    show: false
                }
            }
        },
        {
            title: "Asistencia a Funciones",
            stat: `${porcentajeAsistencia}% asistencia`,
            percentage: parseFloat(porcentajeAsistencia) - 100,
            period: "Últimos 12 meses",
            chartType: "bar",
            series: asistenciaData?.series || [],
            options: {
                colors: ["#10b981", "#ef4444"],
                chart: {
                    type: 'bar',
                    stacked: true,
                },
                plotOptions: {
                    bar: { 
                        horizontal: false,
                        columnWidth: '60%',
                    }
                },
                xaxis: { 
                    categories: asistenciaData?.categories || [],
                },
                legend: {
                    show: true,
                    position: 'top',
                    labels: {
                        colors: '#94a3b8'
                    }
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        {
            title: "Ocupación Promedio por Sala",
            stat: avgOcupacion + "%",
            percentage: -2.5,
            period: "Todas las funciones",
            chartType: "donut",
            series: ocupacionData?.series || [],
            options: {
                labels: ocupacionData?.labels || [],
                colors: ["#3b82f6", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6"],
                chart: {
                    type: 'donut',
                },
                stroke: {
                    show: false
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '14px',
                                    color: '#94a3b8'
                                },
                                value: {
                                    show: true,
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    formatter: (val) => val + '%'
                                },
                                total: {
                                    show: true,
                                    label: 'Promedio',
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    formatter: () => avgOcupacion + '%'
                                }
                            }
                        }
                    }
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    labels: {
                        colors: '#94a3b8'
                    }
                }
            }
        }
    ];

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Reportes y Estadísticas</h1>
                        <p className="text-gray-400">Análisis detallado del rendimiento del cine</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative w-full max-w-5xl mx-auto">
                    {/* Main Card View */}
                    <div className="relative min-h-[600px]">
                        <ReportCard 
                            {...reportCards[currentIndex]} 
                            id={`chart-${currentIndex}`} 
                        />
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    <button 
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="flex justify-center mt-6 gap-2">
                        {reportCards.map((report, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    idx === currentIndex 
                                        ? 'w-8 bg-orange-500' 
                                        : 'w-2 bg-slate-600 hover:bg-slate-500'
                                }`}
                                aria-label={`Ir a ${report.title}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
