import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ReportCard = ({ 
  title, 
  stat, 
  percentage, 
  period = "Últimos 7 días", 
  chartType = "area", 
  series, 
  options, 
  id,
  viewModes = null, // Array of view modes: [{ label: "Ingresos", seriesIndex: 1 }, ...]
  defaultViewMode = 0
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentViewMode, setCurrentViewMode] = useState(defaultViewMode);

  useEffect(() => {
    if (chartRef.current && series && series.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // If viewModes exist, filter series based on current mode
      let filteredSeries = series;
      if (viewModes && viewModes.length > 0) {
        const modeConfig = viewModes[currentViewMode];
        if (modeConfig && typeof modeConfig.seriesIndex === 'number') {
          filteredSeries = [series[modeConfig.seriesIndex]];
        }
      }

      const baseOptions = {
        chart: {
          height: 320,
          type: chartType,
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          show: true,
          borderColor: '#334155',
          strokeDashArray: 4,
          padding: {
            left: 10,
            right: 10,
            top: 0,
            bottom: 0
          },
        },
        xaxis: {
          labels: {
            style: {
              colors: '#94a3b8',
              fontSize: '12px'
            }
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#94a3b8',
              fontSize: '12px'
            }
          }
        },
      };

      // Merge with custom options
      const mergedOptions = { 
        ...baseOptions, 
        ...options,
        series: filteredSeries 
      };
      
      chartInstance.current = new ApexCharts(chartRef.current, mergedOptions);
      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [series, options, chartType, currentViewMode, viewModes]);

  const isPositive = percentage >= 0;

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h5 className="text-3xl font-bold text-white mb-1">{stat}</h5>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
        <div
          className={`flex items-center px-2.5 py-1 text-sm font-semibold rounded ${
            isPositive 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {percentage}%
        </div>
      </div>

      {/* View Mode Toggle (if available) */}
      {viewModes && viewModes.length > 0 && (
        <div className="flex gap-2 mb-4">
          {viewModes.map((mode, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentViewMode(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentViewMode === idx
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart Container */}
      <div ref={chartRef} id={id} className="w-full" style={{ minHeight: '320px' }} />

      {/* Footer */}
      <div className="grid grid-cols-1 items-center border-t border-slate-700 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{period}</span>
          <button
            onClick={() => console.log('Ver detalle:', title)}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver Detalle →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
