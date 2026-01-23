import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import {
  getVentasMensuales,
  getAsistenciaReservas,
  getPeliculasMasReservadas,
  getRankingPeliculasCartelera,
} from '../../../api/Reportes.api.js';

const ReportsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ventasData, setVentasData] = useState(null);
  const [asistenciaData, setAsistenciaData] = useState(null);
  const [peliculasData, setPeliculasData] = useState(null);
  const [rankingCarteleraData, setRankingCarteleraData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [ventas, asistencia, peliculas, rankingCartelera] = await Promise.all([
          getVentasMensuales(),
          getAsistenciaReservas(),
          getPeliculasMasReservadas(),
          getRankingPeliculasCartelera(),
        ]);

        setVentasData(ventas);
        setAsistenciaData(asistencia);
        setPeliculasData(peliculas);
        setRankingCarteleraData(rankingCartelera);
      } catch (error) {
        console.error('Error loading reports:', error);
        setError(error.message || 'Error al cargar los reportes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 3 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 3 : prevIndex - 1));
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

  const ventasDataArray = ventasData?.series?.[0]?.data || [];
  const totalVentas = ventasDataArray.reduce((a, b) => a + b, 0) || 0;
  const ventasMesActual = ventasDataArray[ventasDataArray.length - 1] || 0;
  const ventasMesAnterior = ventasDataArray[ventasDataArray.length - 2] || 0;
  const porcentajeVentas =
    ventasMesAnterior > 0
      ? (((ventasMesActual - ventasMesAnterior) / ventasMesAnterior) * 100).toFixed(1)
      : 0;

  const asistidasDataArray = asistenciaData?.series?.[0]?.data || [];
  const noAsistidasDataArray = asistenciaData?.series?.[1]?.data || [];
  const totalAsistidas = asistidasDataArray.reduce((a, b) => a + b, 0) || 0;
  const totalNoAsistidas = noAsistidasDataArray.reduce((a, b) => a + b, 0) || 0;
  const totalReservasAsistencia = totalAsistidas + totalNoAsistidas;
  const porcentajeAsistencia =
    totalReservasAsistencia > 0 ? ((totalAsistidas / totalReservasAsistencia) * 100).toFixed(1) : 0;

  const asistidasMesActual = asistidasDataArray[asistidasDataArray.length - 1] || 0;
  const noAsistidasMesActual = noAsistidasDataArray[noAsistidasDataArray.length - 1] || 0;
  const totalMesActual = asistidasMesActual + noAsistidasMesActual;
  const tasaAsistenciaMesActual =
    totalMesActual > 0 ? (asistidasMesActual / totalMesActual) * 100 : 0;

  const asistidasMesAnterior = asistidasDataArray[asistidasDataArray.length - 2] || 0;
  const noAsistidasMesAnterior = noAsistidasDataArray[noAsistidasDataArray.length - 2] || 0;
  const totalMesAnterior = asistidasMesAnterior + noAsistidasMesAnterior;
  const tasaAsistenciaMesAnterior =
    totalMesAnterior > 0 ? (asistidasMesAnterior / totalMesAnterior) * 100 : 0;

  const porcentajeCambioAsistencia = (tasaAsistenciaMesActual - tasaAsistenciaMesAnterior).toFixed(
    1
  );

  const asientosDataArray = peliculasData?.series?.[0]?.data || [];
  const peliculasArray = peliculasData?.peliculas || [];
  let peliculaMasPopular = 'Sin datos';
  let maxAsientos = 0;
  asientosDataArray.forEach((asientos, index) => {
    if (asientos > maxAsientos) {
      maxAsientos = asientos;
      peliculaMasPopular = peliculasArray[index] || 'Sin datos';
    }
  });
  const asientosMesActual = asientosDataArray[asientosDataArray.length - 1] || 0;
  const asientosMesAnterior = asientosDataArray[asientosDataArray.length - 2] || 0;
  const porcentajePeliculas =
    asientosMesAnterior > 0
      ? (((asientosMesActual - asientosMesAnterior) / asientosMesAnterior) * 100).toFixed(1)
      : 0;

  const reportCards = [
    {
      title: 'Tickets Vendidos Últimos 12 Meses',
      stat: totalVentas.toString(),
      percentage: parseFloat(porcentajeVentas),
      period: 'Últimos 12 meses',
      chartType: 'area',
      series: ventasData?.series || [],
      viewModes: [
        { label: 'Reservas', seriesIndex: 0 },
        { label: 'Ingresos ($)', seriesIndex: 1 },
      ],
      defaultViewMode: 0,
      options: {
        colors: ['#3b82f6', '#06b6d4'],
        chart: {
          type: 'area',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100],
          },
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        xaxis: {
          categories: ventasData?.categories || [],
        },
        legend: {
          show: false,
        },
      },
    },
    {
      title: 'Asistencia a Funciones',
      stat: `${porcentajeAsistencia}% asistencia`,
      percentage: parseFloat(porcentajeCambioAsistencia),
      period: 'Últimos 12 meses',
      chartType: 'bar',
      series: asistenciaData?.series || [],
      options: {
        colors: ['#10b981', '#ef4444'],
        chart: {
          type: 'bar',
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
          },
        },
        xaxis: {
          categories: asistenciaData?.categories || [],
        },
        legend: {
          show: true,
          position: 'top',
          labels: {
            colors: '#94a3b8',
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
    {
      title: 'Películas Más Reservadas por Mes',
      stat: peliculaMasPopular,
      percentage: parseFloat(porcentajePeliculas),
      period: 'Últimos 12 meses',
      chartType: 'bar',
      series: peliculasData?.series || [],
      options: {
        colors: ['#f59e0b', '#ec4899'],
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            borderRadius: 4,
          },
        },
        xaxis: {
          categories: peliculasData?.categories || [],
          labels: {
            style: {
              colors: '#94a3b8',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#94a3b8',
            },
            formatter: (val) => Math.floor(val),
          },
          title: {
            text: 'Asientos Reservados',
            style: {
              color: '#94a3b8',
            },
          },
        },
        legend: {
          show: true,
          position: 'top',
          labels: {
            colors: '#94a3b8',
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (val, { seriesIndex, dataPointIndex }) => {
              const pelicula = peliculasData?.peliculas?.[dataPointIndex] || 'N/A';
              return `${val} asientos - ${pelicula}`;
            },
          },
        },
      },
    },
    {
      title: 'Ranking Películas en Cartelera',
      stat: rankingCarteleraData?.peliculas?.[0] || 'Sin datos',
      percentage: 0,
      period: 'Últimos 30 días',
      children: (
        <div className="space-y-3 overflow-y-auto max-h-[320px] pr-2 mt-4 scrollbar-thin">
          {rankingCarteleraData?.peliculas?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No hay datos disponibles</div>
          ) : (
            rankingCarteleraData?.peliculas?.map((peli, index) => {
              const asientos = rankingCarteleraData.asientos[index];
              const maxAsientos = Math.max(...(rankingCarteleraData.asientos || [0]));
              const porcentaje = maxAsientos > 0 ? Math.round((asientos / maxAsientos) * 100) : 0;

              return (
                <div
                  key={index}
                  className="group p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                          index === 0
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                            : index === 1
                              ? 'bg-gray-300 text-black shadow-lg shadow-gray-300/20'
                              : index === 2
                                ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20'
                                : 'bg-slate-700 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-white font-medium text-sm md:text-base truncate">
                        {peli}
                      </span>
                    </div>
                    <span
                      className={`text-xs md:text-sm font-mono ${
                        asientos === 0 ? 'text-gray-500' : 'text-purple-400 font-bold'
                      }`}
                    >
                      {asientos} reservas
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        asientos === 0
                          ? 'bg-transparent'
                          : index === 0
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                            : index === 1
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                              : index === 2
                                ? 'bg-gradient-to-r from-amber-700 to-orange-800'
                                : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.max(porcentaje, asientos > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Reportes y Estadísticas
            </h1>
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
            <ReportCard {...reportCards[currentIndex]} id={`chart-${currentIndex}`} />
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
                  idx === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-slate-600 hover:bg-slate-500'
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
