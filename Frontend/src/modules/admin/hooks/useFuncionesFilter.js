import { useState, useCallback, useEffect } from 'react';
import { getFunciones } from '../../../api/Funciones.api';
import { useDebounce } from '../../shared/utils/debounce.js';

export const useFuncionesFilter = (funcionesSinFiltrar, setFunciones, mostrandoActivas = true) => {
  const [filtros, setFiltros] = useState({
    pelicula: '',
    sala: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  
  // Debounce de los filtros de texto para no hacer tantas peticiones
  const debouncedPelicula = useDebounce(filtros.pelicula, 500);
  const debouncedSala = useDebounce(filtros.sala, 500);

  // Apply filters using backend API
  const aplicarFiltros = useCallback(async () => {
    try {
      // Si no hay filtros activos, mostrar datos sin filtrar
      if (!debouncedPelicula && !debouncedSala && !filtros.fechaDesde && !filtros.fechaHasta) {
        setFunciones(funcionesSinFiltrar);
        return;
      }

      // Build filters object for backend
      const backendFiltros = {
        // Agregar estado según la pestaña actual
        estado: mostrandoActivas ? 'activas' : 'inactivas'
      };
      // Enviar nombre de película como texto al backend
      if (debouncedPelicula.trim()) {
        backendFiltros.nombrePelicula = debouncedPelicula.trim();
      }
      
      // Enviar nombre de sala como texto al backend (busca en nombre Y ubicación)
      if (debouncedSala.trim()) {
        backendFiltros.nombreSala = debouncedSala.trim();
      }
      
      // Add date filters
      if (filtros.fechaDesde) {
        backendFiltros.fechaDesde = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        backendFiltros.fechaHasta = filtros.fechaHasta;
      }
      
      // Call backend API with filters
      const funcionesFiltradas = await getFunciones(backendFiltros);
      setFunciones(funcionesFiltradas);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFunciones(funcionesSinFiltrar);
    }
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas, setFunciones, funcionesSinFiltrar]);

  // Clear all filters
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      pelicula: '',
      sala: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    setFunciones(funcionesSinFiltrar);
  }, [funcionesSinFiltrar, setFunciones]);

  // Auto-aplicar filtros cuando cambien los valores debounced
  useEffect(() => {
    if (funcionesSinFiltrar.length > 0) {
      aplicarFiltros();
    }
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas, aplicarFiltros, funcionesSinFiltrar]);

  // Simple handlers that just update the filter state
  const handlePeliculaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, pelicula: valor }));
  }, []);

  const handleSalaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, sala: valor }));
  }, []);

  const handleFilterChange = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  return {
    // State
    filtros,
    
    // Actions
    aplicarFiltros,
    limpiarFiltros,
    handlePeliculaChange,
    handleSalaChange,
    handleFilterChange
  };
};
